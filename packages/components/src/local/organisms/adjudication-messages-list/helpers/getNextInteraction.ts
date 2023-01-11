import { INTER_AT_END, INTER_AT_RANDOM, INTER_AT_START } from '@serge/config'
import { Asset, ForceData, GroupedActivitySet, HealthOutcome, InteractionDetails, INTERACTION_SHORT_CIRCUIT, MessageAdjudicationOutcomes, MessageInteraction, MessagePlanning, PerForcePlanningActivitySet, PlannedProps, PlanningActivity } from '@serge/custom-types'
import * as turf from '@turf/turf'
import { Feature, Geometry } from 'geojson'
import _ from 'lodash'
import moment from 'moment'
import { findPlannedGeometries, findTouching, injectTimes, invertMessages, PlanningContact, putInBin, ShortCircuitEvent, SpatialBin, spatialBinning } from '../../support-panel/helpers/gen-order-data'

const useDate = (msg: MessageInteraction): string => {
  const inter = msg.details.interaction
  if (!inter) {
    throw Error('Interaction missing for message:' + msg.message.Reference)
  }
  return inter.startTime
}

export const timeOfLatestInteraction = (interactions: MessageInteraction[]): number => {
  if (!interactions.length) {
    throw Error('should not be called with zero length interactions')
  }
  const sorted = _.sortBy(interactions, useDate) as MessageInteraction[]
  const date = useDate(sorted[sorted.length - 1])
  return moment(date).valueOf()
}

const timeOfStartOfFirstPlan = (orders: MessagePlanning[]): number => {
  if (!orders.length) {
    throw Error('should not be called with zero length orders')
  }
  const sortFunc = (order: MessagePlanning) => {
    return moment(order.message.startDate).valueOf()
  }
  const sorted = _.sortBy(orders, sortFunc)
  return sortFunc(sorted[0])
}

const timeOfEndOfLastPlan = (orders: MessagePlanning[]): number => {
  if (!orders.length) {
    throw Error('should not be called with zero length orders')
  }
  const reverseSortFunc = (order: MessagePlanning) => {
    return -moment(order.message.endDate).valueOf()
  }
  const sortFunc = (order: MessagePlanning) => {
    return moment(order.message.endDate).valueOf()
  }
  const sorted = _.sortBy(orders, reverseSortFunc)
  return sortFunc(sorted[0])
}

const tStart = (geom: Feature<Geometry>): string => {
  const props = geom.properties as PlannedProps
  return 'Start:' + props.startDate
}
const tEnd = (geom: Feature<Geometry>): string => {
  const props = geom.properties as PlannedProps
  return 'End:' + props.endDate
}

export const createSpecialOrders = (gameTime: number, orders: MessagePlanning[], interactions: MessageInteraction[]): MessagePlanning[] => {
  !7 && console.log(gameTime, orders, interactions)
  return []
}

export const findActivity = (name: string, activities: PerForcePlanningActivitySet): PlanningActivity => {
  let res: PlanningActivity | undefined
  activities.groupedActivities.find((group: GroupedActivitySet) => {
    group.activities.find((plan: PlanningActivity) => {
      if (name.endsWith(plan.name)) {
        res = plan
      }
      return res
    })
    return res
  })
  if (!res) {
    console.log('act', activities.force, activities.groupedActivities[0].activities[0].actId)
    throw Error('Failed to find group activities for this activity:' + name)
  }
  return res
}

const timeFor = (plan: MessagePlanning, activity: PlanningActivity, iType: INTERACTION_SHORT_CIRCUIT): number => {
  // do we have routing?
  if (activity.geometries && activity.geometries.length) {
    // for `first`, use end-time of route-out (first line geometry)
    // for `last`, use start-time of route-back (last line geometry)
    // for `random` create period between `first` and `last`
    console.warn('NOT YET IMPLEMENTED - GETTING TIME FROM GEOMETRIES')
  } else {
    // just use overall message timing
    const tStart = moment.utc(plan.message.startDate).valueOf()
    const tEnd = moment.utc(plan.message.endDate).valueOf()
    switch (iType) {
      case INTER_AT_END:
        return tEnd
      case INTER_AT_START:
        return tStart
      case INTER_AT_RANDOM:
      default: {
        const delta = tEnd - tStart
        return tStart + (Math.random() * delta)
      }
    }
  }
  return -1
}

/** record of how a target site is protected */
interface ProtectedTarget {
  // the force that this target belongs to
  force: ForceData['uniqid']
  // the specific target
  target: Asset
  // SAM sites that protect this target
  protectedBy: Asset[]
}

const strikeOutcomesFor = (plan: MessagePlanning, activity: PlanningActivity, forces: ForceData[], gameTime: number, id: string): MessageAdjudicationOutcomes => {
  const protectedTargets: Array<ProtectedTarget> = []
  const res: MessageAdjudicationOutcomes = {
    messageType: 'AdjudicationOutcomes',
    Reference: id,
    narrative: '',
    healthOutcomes: [],
    perceptionOutcomes: [],
    locationOutcomes: []
  }
  // loop through targets
  if (plan.message.otherAssets) {
    const ownForce = plan.details.from.forceId
    console.table(plan.message.otherAssets)
    plan.message.otherAssets.forEach((target: { asset: string }) => {
      let tgtForce: ForceData | undefined
      let tgtAsset: Asset | undefined
      forces.find((force: ForceData) => {
        if (force.uniqid === ownForce) {
          return false
        } else {
          force.assets && force.assets.some((assetVal: Asset) => {
            if (assetVal.uniqid === target.asset) {
              tgtForce = force
              tgtAsset = assetVal
            }
            return tgtForce
          })
          return tgtForce
        }
      })
      if (tgtForce && tgtAsset) {
        if (tgtAsset.location !== undefined) {
          const tgtPoint = turf.point([tgtAsset.location[1], tgtAsset.location[0]])
          // loop through other assets of that force
          tgtForce.assets && tgtForce.assets.forEach((oppAsset: Asset) => {
            // see if this has MEZ range
            const attrs = oppAsset.attributes
            if (attrs && attrs.a_Mez_Range && oppAsset.location && (oppAsset.health && oppAsset.health > 0)) {
              // ok, it has a MEZ range
              const mezAsset = oppAsset
              // generate
              const mezPoint = turf.point([oppAsset.location[1], oppAsset.location[0]])
              const distanceApart = turf.distance(tgtPoint, mezPoint, { units: 'kilometers' })
              if (distanceApart < attrs.a_Mez_Range && tgtForce && tgtAsset) {
                // ok, it's covered.
                let protTarget = protectedTargets.find((target: ProtectedTarget) => tgtAsset && target.target.uniqid === tgtAsset.uniqid)
                if (!protTarget) {
                  protTarget = {
                    force: tgtForce.uniqid,
                    target: tgtAsset,
                    protectedBy: []
                  }
                  protectedTargets.push(protTarget)
                }
                protTarget.protectedBy.push(mezAsset)
              }
            }
          })
        } else {
          console.warn('Asset missing location')
        }
      }
      // create damage outcome for this asset
      const health: HealthOutcome = {
        asset: target.asset,
        health: 50
      }
      res.healthOutcomes.push(health)
    })
    !7 && console.log(plan, activity, forces, gameTime)
  }

  if (protectedTargets.length) {
    const message = protectedTargets.map((prot: ProtectedTarget) => {
      return prot.target.name + ' protected by ' + prot.protectedBy.map((asset: Asset) => '' + asset.name + ' (' + asset.uniqid + ')').join(', ') + '\n'
    })
    res.narrative += message

    // store the other assets
    const otherAssets: Array<Asset['uniqid']> = []
    protectedTargets.forEach((tgt: ProtectedTarget) => {
      tgt.protectedBy.forEach((asset: Asset) => {
        if (!otherAssets.includes(asset.uniqid)) {
          otherAssets.push(asset.uniqid)
        }
      })
    })
    res.otherAssets = otherAssets
  }

  console.log('strike outcomes', res)
  return res
}

const outcomesFor = (plan: MessagePlanning, activity: PlanningActivity, forces: ForceData[], gameTime: number, id: string): MessageAdjudicationOutcomes => {
  switch (activity.actId) {
    case 'STRIKE': {
      return strikeOutcomesFor(plan, activity, forces, gameTime, id)
    }
    default: {
      console.warn('outcomes not generated for activity', activity.actId)
    }
  }
  return {
    healthOutcomes: [],
    locationOutcomes: [],
    perceptionOutcomes: [],
    narrative: 'Pending',
    messageType: 'AdjudicationOutcomes',
    Reference: id
  }
}

export const getShortCircuit = (gameTime: number, orders: MessagePlanning[], interactions: MessageInteraction[],
  activities: PerForcePlanningActivitySet[], forces: ForceData[]): ShortCircuitEvent | undefined => {
  interface TimedIntervention {
    // id of the interaction (composite of planning message & event)
    id: string
    time: number
    timeStr: string
    message: MessagePlanning
    activity: PlanningActivity
  }

  console.log('calc short circuit before', moment.utc(gameTime).toISOString())

  // loop through plans
  const eventList: TimedIntervention[] = []
  orders.forEach((plan: MessagePlanning) => {
    const force = plan.details.from.forceId
    const forceActivities = activities.find((act: PerForcePlanningActivitySet) => act.force === force)
    if (forceActivities) {
      const actName = plan.message.activity
      const activity = findActivity(actName, forceActivities)
      const activityEvents = activity.events
      if (activityEvents) {
        activityEvents.forEach((short: INTERACTION_SHORT_CIRCUIT) => {
          const thisTime = timeFor(plan, activity, short)
          if (thisTime) {
            const interactionId = plan._id + ' ' + short
            // check this hasn't been processed already
            if (interactions.find((msg: MessageInteraction) => msg.message.Reference === interactionId)) {
              console.warn('Skipping this event, already processed', interactionId)
            } else {
              eventList.push({ time: thisTime, message: plan, timeStr: moment(thisTime).toISOString(), activity: activity, id: interactionId })
            }
          }
        })
      }
    }
  })

  if (eventList.length) {
    // sort in ascending
    const sorted = _.sortBy(eventList, function (inter) { return inter.time })
    const firstEvent = sorted[0]
    const eventTime = firstEvent.time

    if (eventTime <= gameTime) {
      const contact = sorted[0].message

      // sort out the outcomes
      const outcomes = outcomesFor(contact, firstEvent.activity, forces, gameTime, firstEvent.id)
      console.log('event found at', moment(gameTime).toISOString(), firstEvent.id, firstEvent)
      const res: ShortCircuitEvent = {
        id: firstEvent.id,
        message: contact,
        timeStart: eventTime,
        timeEnd: eventTime,
        intersection: undefined,
        outcomes: outcomes,
        activity: firstEvent.activity
      }
      return res
    } else {
      // events found, but not before start time
    }
  }
  return undefined
}

export const formatDuration = (millis: number): string => {
  return parseInt(moment.utc(millis).format('DDD')) - 1 + ' ' + moment.utc(millis).format('HH:mm:ss.SSS')
}

const ordersLiveIn = (orders: MessagePlanning[], gameTimeVal: number, gameTurnEndVal: number): MessagePlanning[] => {
  return orders.filter((plan: MessagePlanning) => {
    const startD = moment.utc(plan.message.startDate).valueOf()
    const endD = moment.utc(plan.message.endDate).valueOf()
    return startD < gameTurnEndVal && endD > gameTimeVal
  })
}

export type InteractionResults = { details: InteractionDetails, outcomes: MessageAdjudicationOutcomes } | number | undefined

export const getNextInteraction2 = (orders: MessagePlanning[],
  activities: PerForcePlanningActivitySet[], interactions: MessageInteraction[],
  _ctr: number, sensorRangeKm: number, gameTime: string, gameTurnEnd: string, forces: ForceData[], getAll: boolean): InteractionResults => {
  const gameTimeVal = moment(gameTime).valueOf()
  const gameTurnEndVal = moment(gameTurnEnd).valueOf()
  const earliestTime = interactions.length ? timeOfLatestInteraction(interactions) : moment(gameTime).valueOf()

  console.log('earliest time', moment(earliestTime).toISOString())
  !7 && console.log(orders, activities, sensorRangeKm, getAll, earliestTime)

  // see if a short-circuit is overdue
  const shortCircuit = !getAll && getShortCircuit(gameTimeVal, orders, interactions, activities, forces)
  console.log('event should have been processed', shortCircuit)

  if (shortCircuit && shortCircuit.timeStart <= gameTimeVal) {
    // return the short-circuit interaction
    const details: InteractionDetails = {
      id: shortCircuit.id,
      orders1: shortCircuit.message._id,
      startTime: moment.utc(shortCircuit.timeStart).toISOString(),
      endTime: moment.utc(shortCircuit.timeEnd).toISOString(),
      complete: false
    }
    const outcomes = outcomesFor(shortCircuit.message, shortCircuit.activity, forces, gameTimeVal, shortCircuit.id)
    if (outcomes.otherAssets) {
      details.otherAssets = outcomes.otherAssets
      delete outcomes.otherAssets
    }
    return { details: details, outcomes: outcomes }
  } else {
    // generate any special orders
    const specialOrders = createSpecialOrders(gameTimeVal, orders, interactions)

    const fullOrders = specialOrders.length > 0 ? orders.concat(specialOrders) : orders

    const fullTurnLength = gameTurnEndVal - gameTimeVal
    let currentWindow = getAll ? fullTurnLength : fullTurnLength / 20

    const contacts: PlanningContact[] = []
    let shortCircuit: ShortCircuitEvent | undefined

    while (contacts.length === 0 && currentWindow <= fullTurnLength && shortCircuit === undefined) {
      const windowEnd = gameTimeVal + currentWindow

      // if we're doing get-all, don't bother with shortcircuits
      if (!getAll) {
        shortCircuit = getShortCircuit(windowEnd, orders, interactions, activities, forces)
        console.log('first event in window:', shortCircuit)
      }

      const liveOrders = ordersLiveIn(fullOrders, gameTimeVal, windowEnd)

      console.log('window size', gameTime, moment(windowEnd).toISOString(), formatDuration(currentWindow), liveOrders.length)

      const newGeometries = invertMessages(liveOrders, activities)
      const withTimes = injectTimes(newGeometries)
      const trimmedGeoms = withTimes // .filter((val) => startBeforeTime(val)).filter((val) => endAfterTime(val))

      // console.table(liveOrders.map((plan: MessagePlanning) => {
      //   return {
      //     id: plan._id,
      //     start: plan.message.startDate,
      //     end: plan.message.endDate
      //   }
      // }))

      const geometriesInTimeWindow = findPlannedGeometries(trimmedGeoms, earliestTime, currentWindow)

      const timeEnd = moment(earliestTime).add(currentWindow, 'm')
      console.log('geoms in this window:', moment(earliestTime).toISOString(), timeEnd.toISOString(), ' windows size (mins):', currentWindow, 'matching geoms:', geometriesInTimeWindow.length)
      //  console.table(withTimes.map((value) => { return { id: value.id, time: value.geometry.properties && moment(value.geometry.properties.startTime).toISOString() } }))

      // now do spatial binning
      const bins = spatialBinning(geometriesInTimeWindow, 4)
      const binnedOrders = putInBin(geometriesInTimeWindow, bins)

      const interactionsProcessed = interactions.map((val) => {
        const inter = val.details.interaction
        if (!inter) {
          throw Error('Interaction missing')
        }
        return inter.id
      })
      const interactionsConsidered: string[] = []
      const interactionsTested: Record<string, PlanningContact | null> = {}

      binnedOrders.forEach((bin: SpatialBin, _index: number) => {
        // console.log('process bin', _index, bin.orders.length, contacts.length)
        const newContacts = findTouching(bin.orders, interactionsConsidered, interactionsProcessed,
          interactionsTested, sensorRangeKm)
        contacts.push(...newContacts)
      })

      console.log('binning complete, contacts:', contacts.length)

      // drop contacts
      const dropContacts = true
      if (dropContacts) {
        while (contacts.length) {
          contacts.pop()
        }
      }

      currentWindow *= 2
    }

    if (currentWindow > fullTurnLength) {
      console.log('Gen next interaction: no contacts in turn')
    }

    // do we have any contacts?
    if (contacts.length !== 0) {
      // sort ascending
      const sortedContacts = _.sortBy(contacts, function (contact) { return moment.utc(contact.timeStart).valueOf() })
      const firstC = sortedContacts[0]

      // just check there isn't a short-circuit before this
      if (shortCircuit !== undefined) {
        const shortStart = shortCircuit.timeStart
        const contStart = firstC.timeStart
        if (shortStart < contStart) {
          // ok, return it
          // return the short-circuit interaction
          const details: InteractionDetails = {
            id: shortCircuit.id,
            orders1: shortCircuit.message._id,
            startTime: moment.utc(shortCircuit.timeStart).toISOString(),
            endTime: moment.utc(shortCircuit.timeEnd).toISOString(),
            complete: false
          }
          const outcomes = outcomesFor(shortCircuit.message, shortCircuit.activity, forces, gameTimeVal, shortCircuit.id)
          if (outcomes.otherAssets) {
            details.otherAssets = outcomes.otherAssets
            delete outcomes.otherAssets
          }
          return { details: details, outcomes: outcomes }
        } else {
          const details = contactDetails(firstC)
          const outcomes = contactOutcomes(firstC)
          return { details: details, outcomes: outcomes }
        }
      } else {
        if (getAll) {
          return contacts.length
        } else {
          const details = contactDetails(firstC)
          const outcomes = contactOutcomes(firstC)
          return { details: details, outcomes: outcomes }
        }
      }
    } else if (shortCircuit) {
      const details: InteractionDetails = {
        id: shortCircuit.id,
        orders1: shortCircuit.message._id,
        startTime: moment.utc(shortCircuit.timeStart).toISOString(),
        endTime: moment.utc(shortCircuit.timeEnd).toISOString(),
        otherAssets: [],
        complete: false
      }
      const outcomes = outcomesFor(shortCircuit.message, shortCircuit.activity, forces, gameTimeVal, shortCircuit.id)
      if (outcomes.otherAssets) {
        details.otherAssets = outcomes.otherAssets
        delete outcomes.otherAssets
      }
      return { details: details, outcomes: outcomes }
    } else {
      return undefined
    }
  }
}

const contactDetails = (contact: PlanningContact): InteractionDetails => {
  const res: InteractionDetails = {
    id: contact.id,
    orders1: contact.first.activity._id,
    orders2: contact.second ? contact.second.activity._id : undefined,
    startTime: moment(contact.timeStart).toISOString(),
    endTime: moment(contact.timeEnd).toISOString(),
    geometry: contact.intersection,
    otherAssets: [],
    complete: false
  }
  return res
}

const contactOutcomes = (contact: PlanningContact): MessageAdjudicationOutcomes => {
  const res: MessageAdjudicationOutcomes = contact.outcomes || {
    messageType: 'AdjudicationOutcomes',
    Reference: contact.first.id + '-' + contact.second.id,
    narrative: '',
    perceptionOutcomes: [],
    locationOutcomes: [],
    healthOutcomes: []
  }
  return res
}

export const getNextInteraction = (orders: MessagePlanning[],
  activities: PerForcePlanningActivitySet[], interactions: MessageInteraction[], _ctr: number, sensorRangeKm: number, getAll?: boolean): PlanningContact[] => {
  const earliestTime = interactions.length ? timeOfLatestInteraction(interactions) : timeOfStartOfFirstPlan(orders)

  // console.log('earliest time', moment(earliestTime).toISOString())
  // console.table(trimmedOrders.map((inter) => {
  //   return {id: inter._id, start: inter.message.startDate, end: inter.message.endDate, force: inter.details.from.forceId}
  // }))

  const newGeometries = invertMessages(orders, activities)
  const withTimes = injectTimes(newGeometries)

  // console.log('geoms', orders, newGeometries, withTimes)

  const trimmedGeoms = withTimes // .filter((val) => startBeforeTime(val)).filter((val) => endAfterTime(val))

  //  console.log('get next a', orders.length, trimmedOrders.length)
  // console.log('get interaction', orders, interactions)
  // console.table(interactions.map((order) => {
  //   return { force: order.details.interaction?.startTime }
  // }))

  console.log('Get Next. Ctr:' + _ctr + ' orders:' + orders.length + ' Interactions:', interactions.length, ' earliest:', moment(earliestTime).toString(), !7 && !!tStart && !!tEnd)

  // console.table(trimmedGeoms.map((val) => {
  //   // return { id: val._id, start: val.message.startDate, end: val.message.endDate }
  //   return { geometry: val.id, start: val.activity.message.startDate, end: val.activity.message.endDate, force: val.force }
  // }))

  // calculate suitable window. First 10%?
  const latestTime = timeOfEndOfLastPlan(orders)
  const diffMins = moment.duration(moment(latestTime).diff(moment(earliestTime))).asMinutes()

  // console.log('timings', moment(earliestTime).toISOString(), moment(latestTime).toISOString(), diffMins)
  // console.table(orders.map((order) => {
  //   return { endTime: order.message.endDate }
  // }))

  let interactionWindow = getAll ? diffMins : Math.max(diffMins / 10, 60)
  const contacts: PlanningContact[] = []

  // console.log('inter window', interactionWindow, diffMins, moment(earliestTime).toISOString(), moment(latestTime).toISOString())

  while (contacts.length === 0 && interactionWindow <= diffMins) {
    const geometriesInTimeWindow = findPlannedGeometries(trimmedGeoms, earliestTime, interactionWindow)

    const timeEnd = moment(earliestTime).add(interactionWindow, 'm')
    console.log('geoms in this window:', moment(earliestTime).toISOString(), timeEnd.toISOString(), ' windows size (mins):', interactionWindow, 'matching geoms:', geometriesInTimeWindow.length)
    //  console.table(withTimes.map((value) => { return { id: value.id, time: value.geometry.properties && moment(value.geometry.properties.startTime).toISOString() } }))

    // now do spatial binning
    const bins = spatialBinning(geometriesInTimeWindow, 4)
    const binnedOrders = putInBin(geometriesInTimeWindow, bins)

    const interactionsProcessed = interactions.map((val) => {
      const inter = val.details.interaction
      if (!inter) {
        throw Error('Interaction missing')
      }
      return inter.id
    })
    const interactionsConsidered: string[] = []
    const interactionsTested: Record<string, PlanningContact | null> = {}

    binnedOrders.forEach((bin: SpatialBin, _index: number) => {
      // console.log('process bin', _index, bin.orders.length, contacts.length)
      const newContacts = findTouching(bin.orders, interactionsConsidered, interactionsProcessed,
        interactionsTested, sensorRangeKm)
      contacts.push(...newContacts)
    })

    interactionWindow *= 2
  }

  if (contacts.length > 0) {
    if (getAll) {
      return contacts
    } else {
      //    console.log('got contacts', Math.floor(interactionWindow), contacts.length, contacts[0].id)
      // sort then
      const sortFunc = (order: PlanningContact): number => {
        return order.timeStart
      }
      const sortedContacts: PlanningContact[] = _.sortBy(contacts, sortFunc)
      // console.table(sortedContacts.map((value) => { return { id: value.id, time: moment(value.timeStart).toISOString() } }))
      const first = sortedContacts[0]
      return [first]
    }
  } else {
    return []
  }
}
