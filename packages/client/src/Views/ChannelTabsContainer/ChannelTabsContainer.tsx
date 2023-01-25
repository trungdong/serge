import FlexLayout, { Model, TabNode } from 'flexlayout-react'
import React, { useEffect, useRef, useState } from 'react'
import { getAllWargameMessages } from '../../ActionsAndReducers/playerUi/playerUi_ActionCreators'
import Loader from '../../Components/Loader'
import { expiredStorage, LOCAL_STORAGE_TIMEOUT } from '../../consts'
import { usePlayerUiDispatch, usePlayerUiState } from '../../Store/PlayerUi'
import computeTabs from './helpers/computeTabs'
import { setDefaultModel } from './helpers/DefaultModel'
import factory from './helpers/factory'
import handleExport from './helpers/handleExport'
import tabRender from './helpers/tabRender'
import Props from './types'

const ChannelTabsContainer: React.FC<Props> = ({ rootRef, onTabChange }): React.ReactElement => {
  const [allowTabChangeEvent, setAllowTabChangeEvent] = useState<boolean>(false)
  const [wargamesLoaded, setWargamesLoaded] = useState(false)
  const selectedNode = useRef<TabNode>()

  const state = usePlayerUiState()
  const playerUiDispatch = usePlayerUiDispatch()
  const { selectedForce, allChannels } = state
  
  if (selectedForce === undefined) throw new Error('selectedForce is undefined')
  
  const [modelName] = useState(`FlexLayout-model-${state.currentWargame}-${selectedForce.uniqid}-${state.selectedRole}`)

  const [modelData] = useState<Model>(() => {
    const model = expiredStorage.getItem(modelName)
    if (model) { 
      return FlexLayout.Model.fromJson(JSON.parse(model))
    } else {
      return FlexLayout.Model.fromJson(setDefaultModel(allChannels))
    }
  })

  const initialize = async () => {
    await getAllWargameMessages(state.currentWargame)(playerUiDispatch)
    if (!wargamesLoaded) {
      setWargamesLoaded(true)
    }
  }

  useEffect(() => {
    initialize()
  }, [state.updateMessageState])

  useEffect(() => {
    if (wargamesLoaded) {
      computeTabs(state, modelData)
    }
  }, [state, wargamesLoaded])

  useEffect(() => {
    if (allowTabChangeEvent && selectedNode.current) {
      onTabChange(selectedNode.current)
      setAllowTabChangeEvent(false)
      // FAKE EVENT, TO TRIGGER EXPORT
      const exportData = handleExport(state)
      console.log('export', exportData)
    }
  }, [allowTabChangeEvent])

  const onRenderTab = (node: TabNode) => {
    tabRender(state)(node)
    if (node.isVisible()) {
      selectedNode.current = node
    }
  }

  return (
    <div className='contain-channel-tabs' data-force={selectedForce.uniqid} ref={rootRef}>
      {
        wargamesLoaded
          ? (
            <FlexLayout.Layout
              model={modelData}
              factory={factory(state)}
              onRenderTab={onRenderTab}
              onModelChange={() => {
                setAllowTabChangeEvent(true)
                expiredStorage.setItem(modelName, JSON.stringify(modelData.toJson()), LOCAL_STORAGE_TIMEOUT)
              }}
            />
          )
          : <Loader />
      }
    </div>
  )
}

export default ChannelTabsContainer
