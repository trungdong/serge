import React, { ReactNode, useState } from 'react'
import L from 'leaflet'
import { PointLike } from 'honeycomb-grid'
import { Polygon, Marker, LayerGroup } from 'react-leaflet'
/* Import Stylesheet */
import styles from './styles.module.scss'

/* Import Types */
import PropTypes from './types/props'
import toWorld from './helpers/to-world'
import { MapContext } from '../mapping'
import SergeHex from '../mapping/types/serge-hex'

/* Render component */
export const HexGrid: React.FC<PropTypes> = ({ gridCells, mapRef }: PropTypes) => {

  const [showCoords, setShowCoords] = useState(false)
  // only show the markers when zoomed in
  if (mapRef && mapRef.current && mapRef.current.leafletElement) {
    mapRef.current.leafletElement.on('zoomend', () => {
      setShowCoords(mapRef.current.leafletElement.getZoom() >= 11)
    })
  }

  return (
    <MapContext.Consumer>
    { (context): ReactNode => {
      // collate list of named polygons
      const polygons: { [id: string]: L.LatLng[] } = {}
      // collate list of named polygon centres
      const centres: { [id: string]: L.LatLng } = {}

      const gc = gridCells || context.props.gridCells

      // create a polygon for each hex, add it to the parent
      gc.forEach((hex: SergeHex<{}>) => {
        // move coords to our map
        const centreWorld: L.LatLng = hex.centreLatLng
        // build up an array of correctly mapped corners
        const cornerArr: L.LatLng[] = []
        // get hex center
        const centreH = hex.center()
        // get hex corners coords
        const corners = hex.corners()
        // convert hex corners coords to our map
        corners.forEach((value: any) => {
          // the corners are relative to the origin (TL). So, offset them to the centre
          const point: PointLike = {
            x: value.x - centreH.x,
            y: value.y - centreH.y
          }
          const newP = toWorld(point, centreWorld, gc.tileDiameterDegs / 2)
          cornerArr.push(newP)
        })
        // add the polygon to polygons array, indexed by the cell name
        polygons[hex.name] = cornerArr
        centres[hex.name] = centreWorld
      })

      return <>
        <LayerGroup key={'hex_polygons'} >{Object.keys(polygons).map(k => (
          <Polygon
            // we may end up with other elements per hex,
            // such as labels so include prefix in key
            key = {'hex_poly_' + k}
            positions={polygons[k]}
            className={styles['default-hex']}
          />
        ))}
        </LayerGroup>
        {showCoords &&
          <LayerGroup key={'hex_labels'} >{Object.keys(centres).map(k => (
            <Marker
              key = {'hex_label_' + k}
              position={centres[k]}
              width="120"
              icon={L.divIcon({
                html: k,
                className: styles['default-coords'],
                iconSize: [30, 20]
              })}
            />
          ))}
          </LayerGroup>
        }
      </>
    }}
  </MapContext.Consumer>
)
}


export default HexGrid
