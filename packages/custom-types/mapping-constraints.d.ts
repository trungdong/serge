import { Domain, CellLabelStyle } from '@serge/config'

export interface TileLayerDefinition {
  url: string,
  attribution: string
}

/**
 * specification of hex grid & mapping backdrop details
 */
export default interface MappingConstraints {
  /** 
   * bounding rectangle 
   */
  bounds: [[number, number], [number, number]],
  /** 
   * h3 resolution to use
   */
  h3res?: number,
  /** 
   * the strategy to use for the cell labels 
   * Note: we allow string so that we can read
   * in JSON data
   */
  cellLabelsStyle?: CellLabelStyle | string
  /**
   * diameter of tiles in use (nautical miles)
   * @deprecated - replaced by H3 definition
   */
  tileDiameterMins: number,
  /**
   * definition of tiled backdrop
   */
  tileLayer?: TileLayerDefinition
  /** 
   * url of tile descriptions
   */
  tileDataFile?: string
  /** 
   * min zoom to display hexes 
   * @deprecated
   */
  minZoomHexes: number
  /** 
   * min zoom level to allow
   */
  minZoom: number
  /**
   * The maximum zoom level
   */
  maxZoom?: number
  /** the maximum zoom present for tiles, after this
   * they will be scaled
   */
  maxNativeZoom: number
  /**
   * target dataset
   * // TODO: remove this, make generic
   * Note: we allow strings, so we can read in JSON data
   */
  targetDataset: Domain | string
  /**
   * Json data url to load atlantic cells data
   * Should refer to file in packages/data folder, 
   * in the form: cells/atlantic-cells-6k.json
   * App will prepend server path
   */
  gridCellsURL?: string
  /**
   * Json data url to load atlantic polygon 
   * outlines for areas of cells, used to reduce
   * Leaflet rendering.
   * Should refer to file in packages/data folder, 
   * in the form: cells/atlantic-polygons.json
   * App will prepend server path
   */
   polygonAreasURL?: string
}