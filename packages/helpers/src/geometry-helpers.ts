import { PerForcePlanningActivitySet, PlannedActivityGeometry, PlannedProps, PlanningActivityGeometry } from '@serge/custom-types'
import * as turf from '@turf/turf'
import { Feature, LineString } from 'geojson'
import moment from 'moment'
import deepCopy from './deep-copy'

const updateLeg = (leg: PlannedActivityGeometry, startT: number, endT: number, speedKts: number,
  millisRemaining: number, outwardLeg: boolean): [PlannedActivityGeometry, number] => {
  // ok, sort times
  if (leg.geometry.geometry.type === 'LineString') {
    const fLine: Feature<LineString> = turf.lineString(leg.geometry.geometry.coordinates)
    const len = turf.length(fLine, { units: 'meters' })
    const speedMs = speedKts * 0.514444
    const millis = (len / speedMs) * 1000

    // mangle the millis, to make things work, if necessary
    if (millis < millisRemaining) {
      console.warn('Will have to trim millis to fit in time period', leg.uniqid)
    }
    const safeMillis = millis < millisRemaining ? millis : millisRemaining / 2

    // console.log('calc legs 0', moment(startT).toISOString(), moment(endT).toISOString())
    // console.log('calc legs 1', Math.floor(len), Math.floor(speedKts), Math.floor(millis), moment(millis).format('DD HH:mm:ss'))

    if (safeMillis < millisRemaining) {
      const props = leg.geometry.properties as PlannedProps
      if (outwardLeg) {
        // ok, update
        const finish = moment.utc(startT).add(safeMillis, 'milliseconds').toISOString()
        // console.log('calc legs 2', moment(startT).toISOString(), Math.floor(safeMillis), finish)
        props.startDate = moment.utc(startT).toISOString()
        props.endDate = finish
      } else {
        // ok, update
        const start = moment.utc(endT).subtract(safeMillis, 'milliseconds').toISOString()
        props.startDate = start
        props.endDate = moment.utc(endT).toISOString()
      }
      // consume time
      const remaining = millisRemaining - safeMillis
      return [leg, remaining]
    }
  }
  return [leg, 0]
}

export const updateLocationNames = (planned: PlannedActivityGeometry[], activities?: PerForcePlanningActivitySet): PlannedActivityGeometry[] => {
  const updatedNames = planned.map((plan) => {
    const id = plan.uniqid
    let activity: PlanningActivityGeometry | undefined
    activities && activities.groupedActivities.some((group) => {
      return group.activities.some((planA) => {
        return planA.geometries && planA.geometries.some((geom) => {
          if (geom.uniqid === id) {
            activity = geom
            return true
          } else {
            return false
          }
        })
      })
    })
    const props = plan.geometry.properties as PlannedProps
    if (activity) {
      props.name = activity.name
    }
    return plan
  })
  return updatedNames
}

/** utility method to correct the timings for planned legs, according to platform speed */
export const updateGeometryTimings = (geometries: PlannedActivityGeometry[], startTime: string, endTime: string, speedKts: number): PlannedActivityGeometry[] => {
  const res = deepCopy(geometries) as PlannedActivityGeometry[]
  let startVal = moment.utc(startTime).valueOf()
  let endVal = moment.utc(endTime).valueOf()
  let remaining = endVal - startVal
  // note: we only update timings if there is more than one leg.  With a single leg
  // we give it all of the time allowed
  if (res.length > 1) {
    const legOut = updateLeg(res[0], startVal, endVal, speedKts, remaining, true)
    if (legOut[1]) {
      res[0] = legOut[0]
      remaining = legOut[1]
      const legOutProps = legOut[0].geometry.properties as PlannedProps
      startVal = moment.utc(legOutProps.endDate).valueOf()
    }
    const legBack = updateLeg(res[res.length - 1], startVal, endVal, speedKts, remaining, false)
    if (legBack[1]) {
      res[res.length - 1] = legBack[0]
      const legOutProps = legBack[0].geometry.properties as PlannedProps
      endVal = moment.utc(legOutProps.startDate).valueOf()
    }
    // give all the remaining non-string goemetries this time period
    res.forEach((plan: PlannedActivityGeometry) => {
      if (plan.geometry.geometry.type !== 'LineString') {
        const props = plan.geometry.properties as PlannedProps
        props.startDate = moment.utc(startVal).toISOString()
        props.endDate = moment.utc(endVal).toISOString()
      }
    })
  } else if (res.length === 1) {
    // give this leg all of the time allowed
    const geom = res[0]
    const props = geom.geometry.properties || {}
    props.startDate = startTime
    props.endDate = endTime
    geom.geometry.properties = props
  }
  return res
}
