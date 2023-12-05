import { FeatureCollection } from 'geojson'
import { LatLng, PM } from 'leaflet'

export default interface PropTypes {
  playerForce: ForceData['id']
  playerRole: Role['id']
  currentTurn: number
  currentPhase: Phase
  forces: ForceStyle[]
  channel: CoreMappingChannel 
  messages: CoreMappingMessage[]
  bounds: L.LatLngBounds
}

export type CoreRendererProps = {
  features: FeatureCollection<Geometry, GeoJsonProperties>
  onChange: (id: number, latlng: LatLng) => void
};

export type GeomanControlProps = {
  onCreate: (e: PM.ChangeEventHandler) => void
  onChange: (id: number, lnglat: LatLng) => void
  onRemoved: (id: number) => void
}
