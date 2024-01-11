import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button } from '@material-ui/core'
import Slide from '@mui/material/Slide'
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import L, { LatLng, PM } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cloneDeep, flatten, unionBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { LayerGroup, MapContainer, TileLayer } from 'react-leaflet-v4'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { BaseRenderer, CoreProperties, MappingMessage, PropertyTypes, RENDERER_CORE, RENDERER_MILSYM } from 'src/custom-types'
import MappingPanel from '../mapping-panel'
import ResizeHandle from '../mapping-panel/helpers/resize-handler'
import { CoreRendererHelper } from './helper/core-renderer-helper'
import MapControls from './helper/map-controls'
import { loadDefaultMarker } from './helper/marker-helper'
import styles from './styles.module.scss'
import PropTypes, { CoreRendererProps } from './types/props'
import circleToPolygon from './helper/circle-to-linestring'

const CoreMapping: React.FC<PropTypes> = ({ messages, channel, playerForce, currentTurn, currentPhase, openPanelAsDefault, postBack }) => {
  const [featureCollection, setFeatureCollection] = useState<FeatureCollection>()
  const [renderers, setRenderers] = useState<React.FunctionComponent<CoreRendererProps>[]>([])
  const [pendingCreate, setPendingCreate] = useState<PM.ChangeEventHandler | null>(null)
  const [checked, setChecked] = useState<boolean>(openPanelAsDefault)

  // const bounds = L.latLngBounds(channel.constraints.bounds)
  const bounds = L.latLngBounds(L.latLng(51.405, -0.02), L.latLng(51.605, -0.13))

  useEffect(() => {
    loadDefaultMarker()
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage: MappingMessage = messages[messages.length - 1]
      setFeatureCollection(lastMessage.featureCollection)
    } else {
      setFeatureCollection(undefined)
    }
  }, [messages])

  useEffect(() => {
    if (channel) {
      const rendererObjects: Array<BaseRenderer> = channel.renderers
      const renList = rendererObjects.map((obj: BaseRenderer) => CoreRendererHelper.from(obj.type))
      setRenderers(renList)
    } else {
      setRenderers([])
    }
  }, [channel])

  const onCreate = (e: PM.ChangeEventHandler) => {
    setPendingCreate(e)
  }

  useEffect(() => {
    if (pendingCreate) {
      const feature = mapEventToFeatures(pendingCreate)
      if (feature && featureCollection && featureCollection.features) {
        const found = featureCollection.features.find(f => f.properties?.id === feature.properties?.id)
        if (!found) {
          featureCollection.features.push(feature)
          const cloneFeatureCollection = cloneDeep(featureCollection)
          setFeatureCollection(cloneFeatureCollection)
          saveNewMessage(cloneFeatureCollection)
        }
      }
      setPendingCreate(null) 
    }
  }, [pendingCreate])
  
  const saveNewMessage = (featureCollection: FeatureCollection<Geometry, GeoJsonProperties>) => {
    const lastMessage: MappingMessage = messages[messages.length - 1]
    const cloneLastMsg = cloneDeep(lastMessage)
    if (cloneLastMsg && featureCollection) {
      cloneLastMsg.featureCollection = featureCollection
      postBack(cloneLastMsg)
    }
  }
  
  const mapEventToFeatures = (e: PM.ChangeEventHandler): Feature | null => {
    const shapeType = (e as any).shape
    const commonProps = {
      id: (e as any).layer._leaflet_id,
      phase: currentPhase,
      label: playerForce.name,
      turn: currentTurn,
      force: playerForce.uniqid,
      category: 'Civilian',
      color: playerForce.color
    }

    switch (shapeType) {
      case 'Line': {
        const locs = (e as any).layer._latlngs as L.LatLng[]
        const reverseLocs = locs.map((item: L.LatLng) => {
          return [item.lng, item.lat]
        })
        const props: CoreProperties = {
          _type: RENDERER_CORE,
          ...commonProps
        }
        return {
          type: 'Feature',
          properties: props,
          geometry: {
            coordinates: reverseLocs,
            type: 'LineString'
          }
        }
      }
      case 'Polygon':
      case 'Rectangle': {
        const locs = (e as any).layer._latlngs as L.LatLng[][]
        const reverseLocs = locs[0].map((item: L.LatLng) => {
          return [item.lng, item.lat]
        })
        const props: CoreProperties = {
          _type: RENDERER_CORE,
          ...commonProps
        }
        return {
          type: 'Feature',
          properties: props,
          geometry: {
            coordinates: [reverseLocs],
            type: 'Polygon'
          }
        }
      }
      case 'Marker': {
        const loc = (e as any).layer._latlng as L.LatLng
        return {
          type: 'Feature',
          properties: {
            _type: RENDERER_MILSYM,
            sidc: 'SFG-UCI----D',
            size: 'M',
            ...commonProps
          },
          geometry: {
            coordinates: [loc.lng, loc.lat],
            type: 'Point'
          }
        }
      }
      case 'Circle': {
        const centre = (e as any).layer._latlng as L.LatLng
        const mRadius = (e as any).layer._mRadius as number
        const coordinates: [number, number] = [centre.lng, centre.lat] // [lon, lat]
        const radius = mRadius // in meters
        const options = { numberOfEdges: 32 }
        const polygon = circleToPolygon(coordinates, radius, options)
        const props: CoreProperties = {
          _type: RENDERER_CORE,
          ...commonProps
        }
        return {
          type: 'Feature',
          properties: props,
          geometry: {
            coordinates: polygon.coordinates,
            type: polygon.type
          }
        }
      }
      default: {
        console.warn('Feature creator not present for ' + shapeType)
        return null
      }
    }
  }

  const onChange = (id: number, latlng: LatLng) => {
    console.log('onChange Event Fired', id, latlng)
    if (featureCollection && featureCollection.features) {
      const idx = featureCollection.features.findIndex(f => f.properties?.id === id)
      if (idx !== -1 && latlng) {
        (featureCollection.features[idx].geometry as any).coordinates = [latlng.lng, latlng.lat]
        setFeatureCollection(cloneDeep(featureCollection))
      }
    }  
  }

  const onRemoved = (id: number) => {
    if (featureCollection && featureCollection.features) {
      const filterFeatures = featureCollection.features.filter(f => f.properties?.id !== id)
      featureCollection.features = filterFeatures
      setFeatureCollection(cloneDeep(featureCollection))
    }
  }

  const onDragged = (id: number | string, latLngs: LatLng | LatLng[] | LatLng[][]) => {
    if (featureCollection && featureCollection.features) {
      const idx = featureCollection.features.findIndex(f => f.properties?.id === id)
      if (idx !== -1 && latLngs) {
        const feature = featureCollection.features[idx]
        switch (feature.geometry.type) {
          case 'Polygon': {
            const coords = latLngs as LatLng[][]
            const newCoords = coords[0].map((pos: LatLng) => {
              return [pos.lng, pos.lat]
            })
            feature.geometry.coordinates = [newCoords]
            break
          }
          case 'LineString': {
            const coords = latLngs as LatLng[]
            const newCoords = coords.map((pos: LatLng) => {
              return [pos.lng, pos.lat]
            })
            feature.geometry.coordinates = newCoords
            break
          }
          case 'Point': {
            const coord = latLngs as LatLng
            feature.geometry.coordinates = [coord.lng, coord.lat]
            break
          }
          default: {
            console.warn('Drag handler not implemented for ' + feature.geometry.type)
          }
        }
        setFeatureCollection(cloneDeep(featureCollection))
      }
    }
  }

  const getExtraFilterProps = (): PropertyTypes[] => {
    const rendererObjects: BaseRenderer[] = channel.renderers
    const flatMap = flatten(rendererObjects.map(r => [...r.baseProps, ...r.additionalProps]))
    return unionBy(flatMap, 'id')
  }

  return <Box className={styles.container}>
    {!checked && <Button variant='contained' onClick={() => setChecked(true)}>
      <FontAwesomeIcon icon={faCircleArrowRight} />
    </Button>}
    <Slide direction='right' in={checked} mountOnEnter timeout={500}>
      <Box className={styles['slide-container']}>
        <PanelGroup direction="horizontal" >
          <Panel
            collapsible={true}
            defaultSizePercentage={35}
            minSizePercentage={35}
            style={{ pointerEvents: 'all' }}
          >
            <MappingPanel onClose={() => setChecked(false)} features={featureCollection} extraFilterProps={getExtraFilterProps()} onSave={saveNewMessage} />
          </Panel>
          <ResizeHandle direction='horizontal' className={styles['resize-handler']} />
          <Panel
            collapsible={true}
            defaultSizePercentage={65}
            style={{ pointerEvents: 'none' }}
          >
          </Panel>
        </PanelGroup>
      </Box>
    </Slide>
    <MapContainer bounds={bounds} zoom={13} scrollWheelZoom={false} className={styles['map-container']}>
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> 
      <MapControls onCreate={onCreate} onChange={onChange}/>
      <LayerGroup>
        {featureCollection && renderers.map((Component, idx) => <Component onRemoved={onRemoved} key={idx + featureCollection.features.length} features={featureCollection} onDragged={onDragged} />) }
      </LayerGroup>
    </MapContainer>
  </Box>
}

export default CoreMapping
