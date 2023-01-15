import Slide from '@material-ui/core/Slide'
import MoreVert from '@material-ui/icons/MoreVert'
import { ADJUDICATION_PHASE, MESSAGE_SENT_INTERACTION } from '@serge/config'
import { MessageDetails, MessageInteraction, MessagePlanning, MessageSentInteraction, MessageStructure, PerForcePlanningActivitySet, PlannedActivityGeometry, PlannedProps, PlanningMessageStructureCore } from '@serge/custom-types'
import { forceColors, ForceStyle, incrementGameTime, platformIcons, PlatformStyle } from '@serge/helpers'
import cx from 'classnames'
import { noop } from 'lodash'
import moment from 'moment'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import NewMessage from '../../form-elements/new-message'
import AdjudicationMessagesList from '../adjudication-messages-list'
import { AdjudicationRow } from '../adjudication-messages-list/types/props'
import PlanningAssets from '../planning-assets'
import { AssetRow } from '../planning-assets/types/props'
import PlanningMessagesList from '../planning-messages-list'
import { collapseLocation, expandLocation } from '../planning-messages-list/helpers/collapse-location'
import { OrderRow } from '../planning-messages-list/types/props'
import { DEFAULT_SIZE, MAX_PANEL_HEIGHT, MAX_PANEL_WIDTH, MIN_PANEL_HEIGHT, MIN_PANEL_WIDTH, PANEL_STYLES, TAB_ADJUDICATE, TAB_MY_FORCE, TAB_MY_ORDERS, TAB_OPP_FOR } from './constants'
import { customiseActivities } from './helpers/customise-activities'
import { customiseAssets } from './helpers/customise-assets'
import { customiseLiveOrders } from './helpers/customise-live-orders'
import { customiseLocation } from './helpers/customise-location'
import TurnFilter, { SHOW_ALL_TURNS } from './helpers/TurnFilter'
import { updateLocationTimings } from './helpers/update-location-timings'
import styles from './styles.module.scss'
import PropTypes, { PanelActionTabsProps, SupportPanelContextInterface } from './types/props'
export const SupportPanelContext = createContext<SupportPanelContextInterface>({ selectedAssets: [], setCurrentAssets: noop, setCurrentOrders: noop, setCurrentInteraction: noop })

export const SupportPanel: React.FC<PropTypes> = ({
  platformTypes,
  planningMessages,
  interactionMessages,
  turnPresentation,
  onRead,
  onUnread,
  onReadAll,
  channel,
  allTemplates,
  adjudicationTemplate,
  mapPostBack,
  saveMessage,
  saveNewActivityTimeMessage,
  saveCachedNewMessageValue,
  getCachedNewMessagevalue,
  clearCachedNewMessage,
  selectedForce,
  selectedRoleId,
  selectedRoleName,
  allForces,
  gameDate,
  gameTurnLength: gameTurnTime,
  currentTurn,
  phase,
  currentWargame,
  setSelectedAssets,
  selectedOrders,
  setSelectedOrders,
  setOpForcesForParent,
  setOwnForcesForParent,
  allOppAssets,
  allOwnAssets,
  onPanelWidthChange,
  draftMessage,
  onCancelDraftMessage,
  forcePlanningActivities,
  editLocation,
  attributeTypes,
  handleAdjudication
}) => {
  const umpireInAdjudication = selectedForce.umpire && (phase === ADJUDICATION_PHASE)
  const [activeTab, setActiveTab] = useState<string>(umpireInAdjudication ? TAB_ADJUDICATE : TAB_MY_FORCE)
  const [isShowPanel, setShowPanel] = useState<boolean>(true)
  const [forceCols] = useState<ForceStyle[]>(forceColors(allForces))
  const [platIcons] = useState<PlatformStyle[]>(platformIcons(platformTypes))

  const [gameTurnEndDate, setGameTurnEndDate] = useState<string>('')

  const [selectedOwnAssets, setSelectedOwnAssets] = useState<AssetRow[]>([])
  const [selectedOpAssets, setSelectedOpAssets] = useState<AssetRow[]>([])
  const [filteredPlanningMessages, setFilteredPlanningMessages] = useState<MessagePlanning[]>([])
  const [filteredInteractionMessages, setFilteredInteractionMessages] = useState<MessageInteraction[]>([])
  const [turnFilter, setTurnFilter] = useState<number>(-1)
  const [localDraftMessage, setLocalDraftMessage] = useState<MessagePlanning | undefined>(undefined)
  const [activitiesForThisForce, setActivitiesForThisForce] = useState<PerForcePlanningActivitySet | undefined>(undefined)
  const [pendingLocationData, setPendingLocationData] = useState<PlannedActivityGeometry[]>([])
  const { setCurrentOrders, setCurrentAssets, setCurrentInteraction } = useContext(SupportPanelContext)

  const onTabChange = (tab: string): void => {
    setShowPanel(activeTab !== tab || !isShowPanel)
    setActiveTab(tab)
  }

  useEffect(() => {
    setLocalDraftMessage(draftMessage)
  }, [draftMessage])

  useEffect(() => {
    if (gameDate !== '' && gameTurnTime) {
      const endDate = incrementGameTime(gameDate, gameTurnTime)
      setGameTurnEndDate(endDate)
    }
    setLocalDraftMessage(draftMessage)
  }, [gameDate, gameTurnTime])

  useEffect(() => {
    if (forcePlanningActivities) {
      const thisForce = forcePlanningActivities.find((act: PerForcePlanningActivitySet) => act.force === selectedForce.uniqid)
      setActivitiesForThisForce(thisForce)
    }
  }, [forcePlanningActivities, selectedForce])

  useEffect(() => {
    const filtered = turnFilter === SHOW_ALL_TURNS ? planningMessages : planningMessages.filter((msg) => msg.details.turnNumber === turnFilter)
    setFilteredPlanningMessages(filtered)
  }, [planningMessages, turnFilter])

  useEffect(() => {
    const filtered = turnFilter === SHOW_ALL_TURNS ? interactionMessages : interactionMessages.filter((msg) => msg.details.turnNumber === turnFilter)
    setFilteredInteractionMessages(filtered)
  }, [interactionMessages, turnFilter])

  const TabPanelActions = ({ onChange, className }: PanelActionTabsProps): React.ReactElement => {
    if (selectedForce.umpire) {
      return <div className={cx(styles['action-tab'], className)}>
        <p onClick={(): void => onChange(TAB_MY_FORCE)} className={cx({ [styles.active]: activeTab === TAB_MY_FORCE })}>All Forces</p>
        <p onClick={(): void => onChange(TAB_MY_ORDERS)} className={cx({ [styles.active]: activeTab === TAB_MY_ORDERS })}>Orders</p>
        <p onClick={(): void => onChange(TAB_ADJUDICATE)} className={cx({ [styles.active]: activeTab === TAB_ADJUDICATE })}>Adjudication</p>
      </div>
    } else {
      return <div className={cx(styles['action-tab'], className)}>
        <p onClick={(): void => onChange(TAB_MY_FORCE)} className={cx({ [styles.active]: activeTab === TAB_MY_FORCE })}>My Force</p>
        <p onClick={(): void => onChange(TAB_MY_ORDERS)} className={cx({ [styles.active]: activeTab === TAB_MY_ORDERS })}>Orders</p>
        <p onClick={(): void => onChange(TAB_OPP_FOR)} className={cx({ [styles.active]: activeTab === TAB_OPP_FOR })}>Other Forces</p>
      </div>
    }
  }

  const onRender = (): void => {
    console.log('=> render')
  }

  useEffect(() => {
    const allSelectedAssets = selectedOwnAssets.concat(selectedOpAssets)
    const selectedAssetIDs = allSelectedAssets.map((row: AssetRow) => row.id)
    setSelectedAssets(selectedAssetIDs)
  }, [selectedOwnAssets, selectedOpAssets])

  useEffect(() => {
    // if there is a draft message, open the `my orders` tab
    if (draftMessage) {
      setActiveTab(TAB_MY_ORDERS)
    }
  }, [draftMessage])

  useEffect(() => {
    onPanelWidthChange && onPanelWidthChange(isShowPanel ? 330 : 0)
  }, [isShowPanel])

  const onVisibleRowsChange = (opFor: boolean, data: AssetRow[]): void => {
    if (opFor) {
      setOpForcesForParent(data)
    } else {
      setOwnForcesForParent(data)
    }
  }

  const cancelNewOrders = (): void => {
    onCancelDraftMessage && onCancelDraftMessage()
    // also the local document
    setLocalDraftMessage(undefined)
  }

  const postBack = (details: MessageDetails, message: any): void => {
    // do we have any pending geometry
    if (pendingLocationData.length > 0) {
      const plan = message as MessagePlanning
      console.log('injecting geometry', plan.message.location, pendingLocationData)
    }

    const activity: MessageSentInteraction = {
      aType: MESSAGE_SENT_INTERACTION
    }

    saveNewActivityTimeMessage(selectedRoleId, activity, currentWargame)

    // fix the location bits, if necessary
    const updatedDoc = localModifyForSave(message)

    saveMessage(currentWargame, details, updatedDoc)()
    // also clear local one
    setLocalDraftMessage(undefined)
  }

  const onSizeChange = (_: MouseEvent | TouchEvent, __: any, elementRef: HTMLElement): void => {
    onPanelWidthChange && onPanelWidthChange(elementRef.offsetWidth)
  }

  const onTurnFilterChange = (turn: number) => {
    setTurnFilter(turn)
  }

  const localCustomiseTemplate = (document: MessageStructure | undefined, schema: Record<string, any>): Record<string, any> => {
    // sort out which orders are currently "live"
    const turnStart = moment(gameDate)
    const turnEnd = moment(gameTurnEndDate)
    const liveOrders: MessagePlanning[] = planningMessages.filter((plan: MessagePlanning) => {
      const startDate = plan.message.startDate
      const endDate = plan.message.endDate
      if (startDate && endDate) {
        const startD = moment(startDate)
        const endD = moment(endDate)
        return startD.isBefore(turnEnd) && endD.isAfter(turnStart)
      } else {
        console.warn('Support panel. Orders start/end missing for', plan)
        return false
      }
    })

    // set the default dates, if this is a planning message
    const docAsAny = document as any
    console.log('doc', docAsAny.ownAssets)
    if (docAsAny.ownAssets !== undefined) {
      const plan = document as PlanningMessageStructureCore
      if (gameDate && (!plan.startDate || !plan.endDate)) {
        plan.startDate = gameDate
        plan.endDate = gameDate
      }
    }

    // now modify the template
    const customisers: Array<{ (document: MessageStructure | undefined, schema: Record<string, any>): Record<string, any> }> = [
      (document, template) => customiseAssets(document, template, allOwnAssets, allOppAssets),
      (document, template) => customiseActivities(document, template, forcePlanningActivities || [], selectedForce),
      (document, template) => customiseLocation(document, template),
      (document, template) => customiseLiveOrders(document, template, liveOrders)
    ]

    let current: Record<string, any> = { ...schema }
    customisers.forEach((fn) => {
      current = fn(document, current)
    })
    return current
  }

  const editThisMessage = (docId: string): void => {
    const order = planningMessages.find((doc) => doc._id === docId)
    setLocalDraftMessage(order)
  }

  const assetsForOrders = (id?: string): string[] => {
    let res: string[] = []
    const plan = planningMessages.find((msg) => msg._id === id)
    if (plan) {
      const mine = plan.message.ownAssets || []
      const myIds = mine.map((val: { asset: string, number: number }): string => val.asset)
      const others = plan.message.otherAssets ? plan.message.otherAssets.map((val: { asset: string }): string => val.asset) : []
      res = myIds.concat(others)
    }
    return res
  }

  const onDetailPanelOpen = (rowData: OrderRow | AdjudicationRow) => {
    // if this is an orders item, or an adjudication, mark the relevant data
    // as 'current
    switch (activeTab) {
      case TAB_MY_ORDERS: {
        const order = rowData as OrderRow
        const plan = planningMessages.find((msg) => msg._id === order.id)
        if (plan) {
          const mine = plan.message.ownAssets || []
          const myIds = mine.map((val: { asset: string, number: number }): string => val.asset)
          const others = plan.message.otherAssets ? plan.message.otherAssets.map((val: { asset: string }): string => val.asset) : []
          const allIds = myIds.concat(others)
          setCurrentAssets(allIds)
          setCurrentOrders([plan._id])
        }
        break
      }
      case TAB_ADJUDICATE: {
        const adj = rowData as AdjudicationRow

        const doc = interactionMessages.find((doc) => doc._id === adj.id)
        if (doc) {
          const inter = doc.details.interaction
          if (inter) {
            // get the assets
            const assets1 = assetsForOrders(inter.orders1)
            const assets2 = assetsForOrders(inter.orders2)
            const assets3 = inter.otherAssets || []
            const allAssets = assets1.concat(assets2).concat(assets3)
            setCurrentAssets(allAssets)
            setCurrentInteraction(adj.id)
          }
        }
      }
    }
  }

  const onDetailPanelClose = () => {
    setCurrentAssets([])
    setCurrentOrders([])
    if (activeTab === TAB_ADJUDICATE) {
      setCurrentInteraction(undefined)
    }
  }

  const storeNewLocation = (geoms: PlannedActivityGeometry[]): void => {
    console.log('storing new geometries', geoms)
    setPendingLocationData(geoms)
  }

  const localEditLocation = (geoms: PlannedActivityGeometry[]): void => {
    console.log('local edit location', geoms)
    setPendingLocationData(geoms)
    editLocation && editLocation(geoms, storeNewLocation)

    // if (message.message.location) {
    //   const localCallback = (newValue: unknown): void => {
    //     pendingLocationData.push(newValue as PlannedActivityGeometry[])
    //   }
    //   // pass the location data object
    //   editLocation && editLocation(message.message.location, localCallback)
    // }
  }

  const onLocationEditorLoaded = (editorElm: HTMLDivElement) => {
    console.log('editorElm: ', editorElm)
  }

  const summariseLocations = (title: string, plans: PlannedActivityGeometry[]): void => {
    console.log('== ' + title + ' ==')
    console.table(plans.map((plan: PlannedActivityGeometry) => {
      const props = plan.geometry.properties as PlannedProps
      return {
        id: plan.uniqid,
        start: props.startDate,
        end: props.endDate
      }
    }))
  }

  const localModifyForSave = (document: Record<string, any>): Record<string, any> => {
    const fixedLocation = expandLocation(document)
    const planDoc = fixedLocation as PlanningMessageStructureCore
    if (planDoc.location && planDoc.ownAssets) {
      const ownAssets = planDoc.ownAssets.map((item: {asset: string}) => item.asset)
      const updatedLocations = updateLocationTimings(planDoc.Reference, planDoc.location, ownAssets, allForces, planDoc.startDate, planDoc.endDate)
      !7 && summariseLocations('before', planDoc.location)
      !7 && summariseLocations('after', updatedLocations)
      planDoc.location = updatedLocations
    }
    return planDoc
  }

  return (
    <div className={styles.root}>
      <Slide direction="right" in={isShowPanel}>
        <div className={styles.panel}>
          <Rnd
            disableDragging
            style={PANEL_STYLES}
            default={DEFAULT_SIZE}
            minWidth={MIN_PANEL_WIDTH}
            maxWidth={MAX_PANEL_WIDTH}
            minHeight={MIN_PANEL_HEIGHT}
            maxHeight={MAX_PANEL_HEIGHT}
            onResize={onSizeChange}
          >
            <div className={styles.content}>
              <div className={cx({ [styles['tab-panel']]: true, [styles.hide]: activeTab !== TAB_MY_FORCE })}>
                <PlanningAssets
                  forceColors={forceCols}
                  assets={allOwnAssets}
                  attributeTypes={attributeTypes}
                  platformStyles={platIcons}
                  forces={allForces}
                  playerForce={selectedForce}
                  platformTypes={platformTypes}
                  render={onRender}
                  opFor={false}
                  onSelectionChange={setSelectedOwnAssets}
                  onVisibleRowsChange={(data): void => onVisibleRowsChange(false, data)}
                />
              </div>
              <div className={cx({ [styles['tab-panel']]: true, [styles.hide]: activeTab !== TAB_MY_ORDERS })}>
                <TurnFilter label='Show orders for turn:' currentTurn={currentTurn} value={turnFilter} onChange={onTurnFilterChange} />
                <PlanningMessagesList
                  messages={filteredPlanningMessages}
                  gameDate={gameDate}
                  gameTurnEndDate={gameTurnEndDate}
                  playerForceId={selectedForce.uniqid}
                  playerRoleId={selectedRoleId}
                  isUmpire={!!selectedForce.umpire}
                  turnPresentation={turnPresentation}
                  selectedForce={selectedForce}
                  selectedRoleName={selectedRoleName}
                  currentTurn={currentTurn}
                  hideForcesInChannel={false}
                  onRead={onRead}
                  onUnread={onUnread}
                  onMarkAllAsRead={onReadAll}
                  channel={channel}
                  allTemplates={allTemplates}
                  confirmCancel={true}
                  customiseTemplate={localCustomiseTemplate}
                  selectedOrders={selectedOrders}
                  setSelectedOrders={setSelectedOrders}
                  postBack={postBack}
                  turnFilter={turnFilter}
                  editLocation={editLocation}
                  modifyForSave={localModifyForSave}
                  forcePlanningActivities={forcePlanningActivities}
                  onDetailPanelOpen={onDetailPanelOpen}
                  onDetailPanelClose={onDetailPanelClose}
                  editThisMessage={editThisMessage}
                />
                {localDraftMessage && <NewMessage
                  orderableChannel={true}
                  privateMessage={!!selectedForce.umpire}
                  templates={allTemplates}
                  title={'New Orders'}
                  hideTemplateSelector={true}
                  saveCachedNewMessageValue={saveCachedNewMessageValue}
                  getCachedNewMessagevalue={getCachedNewMessagevalue}
                  clearCachedNewMessage={clearCachedNewMessage}
                  selectedRole={selectedRoleId}
                  selectedForce={selectedForce}
                  selectedRoleName={selectedRoleName}
                  confirmCancel={true}
                  onCancel={cancelNewOrders}
                  channel={channel}
                  currentTurn={currentTurn}
                  gameDate={gameDate}
                  postBack={postBack}
                  customiseTemplate={localCustomiseTemplate}
                  modifyForEdit={(document) => collapseLocation(document, activitiesForThisForce)}
                  modifyForSave={localModifyForSave}
                  draftMessage={localDraftMessage}
                  editCallback={localEditLocation}
                />}
              </div>
              <div className={cx({ [styles['tab-panel']]: true, [styles.hide]: activeTab !== TAB_OPP_FOR })}>
                <PlanningAssets
                  forceColors={forceCols}
                  platformStyles={platIcons}
                  attributeTypes={attributeTypes}
                  assets={allOppAssets}
                  platformTypes={platformTypes}
                  forces={allForces}
                  playerForce={selectedForce}
                  render={onRender}
                  opFor={true}
                  onSelectionChange={setSelectedOpAssets}
                  onVisibleRowsChange={(data): void => onVisibleRowsChange(true, data)}
                />
              </div>
              <div className={cx({ [styles['tab-panel']]: true, [styles.hide]: activeTab !== TAB_ADJUDICATE })}>
                <TurnFilter label='Show interactions for turn:' currentTurn={currentTurn} value={turnFilter} onChange={onTurnFilterChange} />
                <AdjudicationMessagesList
                  interactionMessages={filteredInteractionMessages}
                  planningMessages={filteredPlanningMessages}
                  forces={allForces}
                  gameDate={gameDate}
                  gameTurnLength={gameTurnTime}
                  playerRoleId={selectedRoleId}
                  forceColors={forceCols}
                  onRead={onRead}
                  onUnread={onUnread}
                  onMarkAllAsRead={onReadAll}
                  mapPostBack={mapPostBack}
                  channel={channel}
                  template={adjudicationTemplate}
                  customiseTemplate={localCustomiseTemplate}
                  forcePlanningActivities={forcePlanningActivities}
                  turnFilter={turnFilter}
                  platformTypes={platformTypes}
                  onDetailPanelOpen={onDetailPanelOpen}
                  onDetailPanelClose={onDetailPanelClose}
                  handleAdjudication={handleAdjudication}
                  postBack={postBack}
                  onLocationEditorLoaded={onLocationEditorLoaded}
                />
              </div>
              <div className={styles['resize-indicator-container']} >
                <div className={styles['resize-indicator-icon']} >
                  <MoreVert fontSize='large' color='primary' style={{ marginLeft: 0 }} />
                </div>
              </div>
            </div>
          </Rnd>
          <TabPanelActions onChange={onTabChange} />
        </div>
      </Slide>
      <TabPanelActions onChange={onTabChange} className={styles['secondary-action-tab']} />
    </div>
  )
}

const areEqual = (prevProps: PropTypes, nextProps: PropTypes): boolean => JSON.stringify(prevProps) === JSON.stringify(nextProps)

export default React.memo(SupportPanel, areEqual)
