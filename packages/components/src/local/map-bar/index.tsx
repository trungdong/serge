import React, { useState, useEffect, useContext } from 'react'
import cx from 'classnames'
import { ArrowRight } from '@material-ui/icons'
import assetDialogFor from './helpers/asset-dialog-for'
import { kebabCase } from 'lodash'

/* Import Stylesheet */
import styles from './styles.module.scss'
import { MapContext } from '../mapping'

/* Import child components */
import WorldState from '../world-state'
import PerceptionForm from '../perception-form'
import AdjudicateTurnForm from '../adjudicate-turn-form'
import PlanTurnForm from '../plan-turn-form'
import { PlanTurnFormData } from '@serge/custom-types'

/* Render component */
export const MapBar: React.FC = () => {
  /* Set our intial states */
  const [currentForm, setCurrentForm] = useState('')
  const [currentAssetName, setCurrentAssetName] = useState('')

  /* Pull in the context from MappingContext */
  const {
    playerForce,
    phase,
    platforms,
    showMapBar,
    setShowMapBar,
    selectedAsset,
    perceptionFormData,
    adjudicateTurnFormData,
    setPlanTurnFormData,
    setPerceptionFormData,
    setAdjudicateTurnFormData
  } = useContext(MapContext).props

  // Selects the current asset
  useEffect(() => {
    setCurrentForm(assetDialogFor(playerForce, selectedAsset.force, selectedAsset.controlledBy, phase))
    setCurrentAssetName(selectedAsset.name)
  }, [selectedAsset])

  // Toggles the map bar on and off
  const clickEvent = (): void => {
    showMapBar ? setShowMapBar(false) : setShowMapBar(true)
  }

  /* TODO: This should be refactored into a helper */
  const formSelector = (form: string): any => {
    let output = null
    switch (form) {
      case 'PerceivedAs':
        // collate data

        output = <PerceptionForm formData={perceptionFormData} postBack={setPerceptionFormData} />
        break
      case 'Adjudication':
        output = <AdjudicateTurnForm formHeader={currentAssetName} formData={adjudicateTurnFormData} postBack={setAdjudicateTurnFormData} />
        break
      case 'Planning':
        const currentPlatform = platforms && platforms.find((platform: any) => kebabCase(platform.name) === selectedAsset.type)
        const availableStatus = currentPlatform && currentPlatform.states.find((s: any) => s.name === selectedAsset.status.state)
        const formData: PlanTurnFormData = {
          populate: {
            status: currentPlatform && currentPlatform.states ? currentPlatform.states.map((s: any) => { return { name: s.name, mobile: s.mobile } }) : [],
            speed: currentPlatform && currentPlatform.speedKts ? currentPlatform.speedKts : []
          },
          values: {
            statusVal: availableStatus,
            speedVal: selectedAsset.status.speedKts,
            turnsVal: 0
          }
        }
        output = <PlanTurnForm formHeader={currentAssetName} formData={formData} postBack={setPlanTurnFormData}/>
        break
      default:
        output = null
        break
    }
    return output
  }

  return (
    <div className={cx(styles['map-bar'], showMapBar && styles.open)}>
      <div className={styles.toggle} onClick={clickEvent}><ArrowRight /></div>
      <div className={styles.inner}>
        <section>
          <WorldState name="World State"></WorldState>
        </section>
        <section>
          {currentForm !== '' && selectedAsset.uniqid !== '' && formSelector(currentForm)}
        </section>
      </div>
    </div>
  )
}

export default MapBar
