import { INFO_MESSAGE_CLIPPED, Phase } from '@serge/config'
import { Asset, ForceData, GroupedActivitySet, MessageInfoTypeClipped, MessagePlanning, PerForcePlanningActivitySet, PlainInteraction, PlannedActivityGeometry, PlanningActivity } from '@serge/custom-types'
import { findAsset, forceColors, platformIcons } from '@serge/helpers'
import cx from 'classnames'
import { LatLngBounds, latLngBounds, LatLngExpression } from 'leaflet'
import _, { noop } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'

import { LayerGroup, MapContainer } from 'react-leaflet-v4'
import Item from '../../map-control/helpers/item'
import ApplyFilter from '../apply-filter'
import MapPlanningOrders from '../map-planning-orders'
import { getOppAssets, getOwnAssets } from '../planning-assets/helpers/collate-assets'
import { AssetRow } from '../planning-assets/types/props'
import PlanningForces from '../planning-force'
import SupportMapping from '../support-mapping'
import SupportPanel, { SupportPanelContext } from '../support-panel'
import { PlanningContact, randomOrdersDocs } from '../support-panel/helpers/gen-order-data'
import ViewAs from '../view-as'
import NewOrderActions from './helpers/NewOrdersActions'
import OrderDrawing from './helpers/OrderDrawing'
import OrderPlotter from './helpers/OrderPlotter'
import PlanningActitivityMenu from './helpers/PlanningActitivityMenu'
import styles from './styles.module.scss'
import PropTypes from './types/props'

export const PlanningChannel: React.FC<PropTypes> = ({
  dispatch,
  reduxDispatch,
  getAllWargameMessages,
  markUnread,
  markAllAsRead,
  saveNewActivityTimeMessage,
  openMessage,
  saveMessage,
  templates,
  messages,
  channel,
  adjudicationTemplate,
  selectedRoleId,
  selectedRoleName,
  currentWargame,
  selectedForce,
  phase,
  allForces,
  platformTypes,
  gameDate,
  currentTurn,
  forcePlanningActivities
}) => {
  const [channelTabClass, setChannelTabClass] = useState<string>('')
  const [position, setPosition] = useState<LatLngExpression | undefined>(undefined)
  const [zoom] = useState<number>(12)
  const [bounds, setBounds] = useState<LatLngBounds | undefined>(latLngBounds([[-1.484, 150.1536], [-21.941, 116.4863]]))

  // which force to view the data as
  const [viewAsForce, setViewAsForce] = useState<ForceData['uniqid']>(selectedForce.uniqid)
  const [currentForce, setCurrentForce] = useState<ForceData>(selectedForce)

  // all of the assets known to players of this force
  const [allOwnAssets, setAllOwnAssets] = useState<AssetRow[]>([])
  const [allOppAssets, setAllOppAssets] = useState<AssetRow[]>([])

  const [ownAssetsFiltered, setOwnAssetsFiltered] = useState<AssetRow[]>([])
  const [opAssetsFiltered, setOpAssetsFiltered] = useState<AssetRow[]>([])

  const [filterApplied, setFilterApplied] = useState<boolean>(true)

  // handle selections from asset tables
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const [mapWidth, setMapWidth] = useState<string>('calc(100% - 330px)')

  // the planning activiites for the selected force
  const [flattenedPlanningActivities, setFlattenedPlanningActivities] = useState<PlanningActivity[]>([])
  const [thisForcePlanningActivities, setThisForcePlanningActivities] = useState<PerForcePlanningActivitySet | undefined>(undefined)

  const [planningMessages, setPlanningMessages] = useState<MessagePlanning[]>([])

  const [debugStep, setDebugStep] = useState<number>(0)

  const [activityBeingPlanned, setActivityBeingPlanned] = useState<PlanningActivity | undefined>(undefined)

  useEffect(() => {
    if (forcePlanningActivities) {
      const force = forcePlanningActivities.find((val: PerForcePlanningActivitySet) => val.force === selectedForce.uniqid)
      setThisForcePlanningActivities(force)

      // produce flattened set of activities, for convenience
      if (force) {
        const activities: Array<PlanningActivity[]> = force.groupedActivities.map((val: GroupedActivitySet) => val.activities as PlanningActivity[])
        setFlattenedPlanningActivities(_.flatten(activities))
      }
    }
  }, [selectedForce, forcePlanningActivities])

  useEffect(() => {
    const force = allForces.find((force: ForceData) => force.uniqid === viewAsForce)
    if (force) {
      setCurrentForce(force)
    }
  }, [viewAsForce])

  useEffect(() => {
    console.log('selected orders updated')
  }, [selectedOrders])

  useEffect(() => {
    // produce the own and opp assets for this player force
    const forceCols = forceColors(allForces)
    const platIcons = platformIcons(platformTypes)
    const own = getOwnAssets(allForces, forceCols, platIcons, currentForce)
    const opp = getOppAssets(allForces, forceCols, platIcons, currentForce)
    setAllOwnAssets(own)
    setOwnAssetsFiltered(own.slice())
    setAllOppAssets(opp)
    setOpAssetsFiltered(opp.slice())
  }, [allForces, currentForce])

  useEffect(() => {
    if (selectedAssets.length) {
      const assets = selectedAssets.map((id: string): Asset => findAsset(allForces, id))
      const assetsWithLocation = assets.filter((asset: Asset) => asset.location !== undefined)
      const locations: any = assetsWithLocation.map((asset: Asset) => asset.location)
      if (locations.length > 0) {
        let mapBounds: LatLngBounds | undefined
        locations.forEach((loc: [number, number]) => {
          if (!mapBounds) {
            mapBounds = latLngBounds(loc, loc)
          } else {
            mapBounds.extend(loc)
          }
        })
        if (mapBounds) {
          // do we actually just have one location?
          if (mapBounds.getNorthWest().equals(mapBounds.getSouthEast())) {
            // ok, treat it as new map centre
            setBounds(undefined)
            setPosition(mapBounds.getNorthWest())
          } else {
            // zoom to
            setPosition(undefined)
            setBounds(mapBounds)
          }
        }
      }
    }
  }, [selectedAssets])

  useEffect(() => {
    const channelClassName = channel.name.toLowerCase().replace(/ /g, '-')
    if (messages.length === 0) {
      getAllWargameMessages(currentWargame)(dispatch)
    }
    setChannelTabClass(`tab-content-${channelClassName}`)
  }, [])

  const onReadAll = (): void => {
    dispatch(markAllAsRead(channel.uniqid))
  }

  useEffect(() => {
    // drop the turn markers
    const myMessages: MessagePlanning[] = messages.filter((msg: MessagePlanning | MessageInfoTypeClipped) => msg.messageType !== INFO_MESSAGE_CLIPPED) as MessagePlanning[]
    setPlanningMessages(myMessages)
    console.warn('have set planning messages', messages.length, myMessages.length)
  }, [messages])

  const onRead = (detail: MessagePlanning): void => {
    dispatch(openMessage(channel.uniqid, detail as any as MessageChannel))
  }

  const onUnread = (message: MessagePlanning): void => {
    if (message._id) {
      message.hasBeenRead = false
    }
    dispatch(markUnread(channel.uniqid, message as any))
  }

  const newActiveMessage = (roleId: string, activityMessage: string): void => {
    // we don't have a message id at this point, player has only opened empty template
    const newMessage: PlainInteraction = {
      aType: activityMessage
    }
    saveNewActivityTimeMessage(roleId, newMessage, currentWargame)(reduxDispatch)
  }

  const onPanelWidthChange = (width: number): void => setMapWidth(`calc(100% - ${width}px)`)

  const mapActionCallback = (force: string, category: string, actionId: string): void => {
    console.log('action clicked', force, category, actionId)
  }

  // const onDrawingComplete = (geometries: PlannedActivityGeometry[]): void => {
  //   setCurrentActivity(undefined)
  //   window.alert('Geometries complete ' + geometries.length)
  // }

  // const startDrawing = (): void => {
  //   if (planningActivities) {
  //     setCurrentActivity(planningActivities[0])
  //   }
  // }

  const supportPanelContext = useMemo(() => ({ selectedAssets }), [selectedAssets])

  const genData = (): void => {
    const newPlan = forcePlanningActivities && forcePlanningActivities[0].groupedActivities[0].activities[1] as PlanningActivity
    setActivityBeingPlanned(newPlan)

    const newOrders = randomOrdersDocs(10, allForces, [allForces[1].uniqid, allForces[2].uniqid], flattenedPlanningActivities)
    !7 && console.log(newOrders)
  }

  const incrementDebugStep = (): void => {
    setDebugStep(1 + debugStep)
  }

  const newActionRequest = (group: string, planId: string): void => {
    console.log('new orders for', group, planId)
  }

  const handleAdjudication = (contact: PlanningContact): void => {
    console.log('Apply some adjudication for', contact.id)
  }

  const activityPlanned = (geoms: PlannedActivityGeometry[]): void => {
    console.log('geoms planned', geoms)
    setActivityBeingPlanned(undefined)
  }

  const planNewActivity = (group: GroupedActivitySet['category'], activity: PlanningActivity['uniqid']) => {
    console.log('plan new activity', group, activity)
  }

  const mapChildren = useMemo(() => {
    return (
      <>
        <MapPlanningOrders forceColor={selectedForce.color} orders={planningMessages} activities={flattenedPlanningActivities} setSelectedOrders={noop} />
        <LayerGroup key={'own-forces'}>
          <PlanningForces opFor={false} assets={filterApplied ? ownAssetsFiltered : allOwnAssets} setSelectedAssets={setSelectedAssets} selectedAssets={selectedAssets} />
        </LayerGroup>
        <LayerGroup key={'opp-forces'}>
          <PlanningForces opFor={true} assets={filterApplied ? opAssetsFiltered : allOppAssets} setSelectedAssets={setSelectedAssets} selectedAssets={selectedAssets} />
        </LayerGroup>
        {/* <PolylineDecorator latlngs={polylineLatlgn} layer={geomanLayer} /> */}
        <OrderPlotter activities={forcePlanningActivities || []} handleAdjudication={handleAdjudication} orders={planningMessages}
          step={debugStep} />
        <PlanningActitivityMenu handler={planNewActivity} planningActivities={thisForcePlanningActivities} />
      </>
    )
  }, [selectedAssets, filterApplied, ownAssetsFiltered, allOwnAssets, opAssetsFiltered, allOppAssets])

  return (
    <div className={cx(channelTabClass, styles.root)} data-channel-id={channel.uniqid}>
      <SupportPanelContext.Provider value={supportPanelContext}>
        <SupportPanel
          channel={channel}
          platformTypes={platformTypes}
          messages={planningMessages as MessagePlanning[]}
          onReadAll={onReadAll}
          onUnread={onUnread}
          onRead={onRead}
          templates={templates}
          adjudicationTemplate={adjudicationTemplate}
          activityTimeChanel={newActiveMessage}
          saveMessage={saveMessage}
          saveNewActivityTimeMessage={saveNewActivityTimeMessage}
          dispatch={reduxDispatch}
          currentWargame={currentWargame}
          isUmpire={!!selectedForce.umpire}
          selectedRoleName={selectedRoleName}
          selectedRoleId={selectedRoleId}
          selectedForce={currentForce}
          allForces={allForces}
          gameDate={gameDate}
          currentTurn={currentTurn}
          selectedAssets={selectedAssets}
          setSelectedAssets={setSelectedAssets}
          selectedOrders={selectedOrders}
          setSelectedOrders={setSelectedOrders}
          setOpForcesForParent={setOpAssetsFiltered}
          setOwnForcesForParent={setOwnAssetsFiltered}
          allOwnAssets={allOwnAssets}
          allOppAssets={allOppAssets}
          onPanelWidthChange={onPanelWidthChange}
        />
      </SupportPanelContext.Provider>
      <div className={styles['map-container']}>
        <div style={{ width: mapWidth }}>
          <MapContainer
            className={styles.map}
            zoomControl={false}
            center={bounds?.getCenter()}
            zoom={zoom}
          >
            <SupportMapping
              bounds={bounds}
              position={position}
              actionCallback={mapActionCallback}
              mapWidth={mapWidth}
              toolbarChildren={
                <>
                  {!activityBeingPlanned &&
                    <>
                      <ApplyFilter filterApplied={filterApplied} setFilterApplied={setFilterApplied} />
                      <NewOrderActions playerForce={selectedForce.uniqid} actions={forcePlanningActivities || []}
                        newActionHandler={newActionRequest} phase={phase} isUmpire={selectedForce.umpire || false} />
                      <ViewAs isUmpire={!!selectedForce.umpire} forces={allForces} viewAsCallback={setViewAsForce} viewAsForce={viewAsForce} />
                      {
                        phase === Phase.Planning && !selectedForce.umpire &&
                        <div className={cx('leaflet-control')}>
                          <Item onClick={genData}>Plan</Item>
                        </div>
                      }
                      <div className={cx('leaflet-control')}>
                        <Item onClick={incrementDebugStep}>Step</Item>
                      </div>
                    </>
                  }
                  <OrderDrawing activity={activityBeingPlanned} planned={activityPlanned} cancelled={() => setActivityBeingPlanned(undefined)} />
                </>
              }>
              <>
                {mapChildren}
              </>
            </SupportMapping>
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default PlanningChannel
