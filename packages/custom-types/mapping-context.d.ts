import { Phase } from '@serge/config'
import SergeHex from './serge-hex'
import SergeGrid from './serge-grid'
import PlanMobileAsset from './plan-mobile-asset'

interface SelectedAsset {
  /**
   * unique id
   */
  id: string
  /**
   * current hex position of asset
   */
  position: number[]
  /**
   *  type of asset
   */
  type: string
  /**
   * force-id for asset
   */
  force: string
  /**
   *  list of force-ids for who can control this asset
   */
  controlledBy: string[]
}

/**
 * mapping context, shared with child elements
 */
export default interface MappingContext {
  /**
   * grid of cells, used for movement
   */
  gridCells: SergeGrid<SergeHex<{}>> | undefined
  /**
   * list of forces within this wargame
   */
  forces: any
  /**
   * list of platforms within this wargame
   */
  platforms: any
  /**
   * force for current player
   */
  playerForce: string
  /**
   * phase of current game
   */
  phase: Phase
  /**
   * mobility for selected asset
   */
  planningConstraints: PlanMobileAsset | undefined
  /**
   *  how far platform can travel
   */
  planningRange: number | undefined
  /**
   * state for if map bar is open
   */
  showMapBar: boolean
  /**
   * setter for when planned route is complete
   */
  setNewLeg: React.Dispatch<React.SetStateAction<Array<SergeHex<{}>> | undefined>>
  /**
   *  setter, to modify if map bar is open or not
   */
  setShowMapBar: React.Dispatch<React.SetStateAction<boolean>>
  /**
   * state for which form should appear in the map bar
   */
  selectedAsset: SelectedAsset
  /**
   *  setter, to modify the currently selected asset
   **/
  setSelectedAsset: React.Dispatch<React.SetStateAction<SelectedAsset>>
  /**
   *  state for zoom Level
   **/
  zoomLevel: number
  /**
   *  setter, to set the zoom level
   **/
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>
  /**
   * State containing data for Perception Form
   */
  perceptionFormData: any,
  /**
   * State containing data for Plan turn Form
   */
  planTurnFormData: any,
  /**
   * State containing data for Adjudicate turn Form
   */
  adjudicateTurnFormData: any,
  /**
   * Setter to update Plan turn form
   */
  setPlanTurnFormData: React.Dispatch<React.SetStateAction<any>>,
  /**
   * Setter to update Perception form
   */
  setPerceptionFormData: React.Dispatch<React.SetStateAction<any>>,
  /**
   * Setter to update Adjudicate turn form
   */
  setAdjudicateTurnFormData: React.Dispatch<React.SetStateAction<any>>
}
