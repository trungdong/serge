import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button } from '@material-ui/core'
import Slide from '@mui/material/Slide'
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import L, { LatLng, PM } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cloneDeep, flatten, get, isEqual, unionBy, uniq } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { LayerGroup, MapContainer, TileLayer } from 'react-leaflet-v4'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { PanelSize } from 'src/Components/CoreMappingChannel'
import { INFO_MESSAGE_CLIPPED, MAPPING_MESSAGE, MAPPING_MESSAGE_DELTA } from 'src/config'
import { BaseProperties, BaseRenderer, CoreProperties, MappingMessage, MappingMessageDelta, Message, MessageDetails, MilSymProperties, PROPERTY_ENUM, PROPERTY_NUMBER, PROPERTY_STRING, PropertyType, RENDERER_CORE, RENDERER_MILSYM } from 'src/custom-types'
import MappingPanel from '../mapping-panel'
import ResizeHandle from '../mapping-panel/helpers/resize-handler'
import circleToPolygon from './helper/circle-to-linestring'
import { CoreRendererHelper } from './helper/core-renderer-helper'
import { applyPatch, generatePatch, getAllFeatureIds } from './helper/feature-collection-helper'
import MapControls from './helper/map-controls'
import { MappingProvider } from './helper/mapping-provider'
import { loadDefaultMarker } from './helper/marker-helper'
import { DEFAULT_FONT_SIZE, DEFAULT_PADDING } from './renderers/milsymbol-renderer'
import styles from './styles.module.scss'
import PropTypes, { CoreRendererProps } from './types/props'
  
const CoreMapping: React.FC<PropTypes> = ({ messages, channel, playerForce, playerRole, currentTurn, currentPhase, openPanelAsDefault, forceStyles, postBack, panelSize }) => {
  const [featureCollection, setFeatureCollection] = useState<FeatureCollection>()
  const [renderers, setRenderers] = useState<React.FunctionComponent<CoreRendererProps>[]>([])
  const [pendingCreate, setPendingCreate] = useState<PM.ChangeEventHandler | null>(null)
  const [checked, setChecked] = useState<boolean>(openPanelAsDefault)
  const [selectedFeature, setSelectedFeature] = useState<string[]>([])
  const [showLabels, setShowLabels] = useState<boolean>(false)
  const lastMessages = useRef<MappingMessage>()

  const [filterFeatureIds, setFilterFeatureIds] = useState<string[]>([])
  const [deselecteFeature, setDeselectFeature] = useState<boolean>(false)
  const [localPanelSize, setLocalPanelSize] = useState<PanelSize | undefined>(panelSize)
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false)

  const mappingProviderValue = useMemo(() => ({
    filterFeatureIds,
    setFilterFeatureIds,
    deselecteFeature,
    setDeselectFeature,
    localPanelSize,
    setLocalPanelSize,
    isMeasuring,
    setIsMeasuring
  }), [
    filterFeatureIds,
    setFilterFeatureIds,
    deselecteFeature,
    setDeselectFeature,
    localPanelSize,
    setLocalPanelSize,
    isMeasuring,
    setIsMeasuring
  ])

  // const bounds = L.latLngBounds(channel.constraints.bounds)
  const bounds = L.latLngBounds(L.latLng(51.405, -0.02), L.latLng(51.605, -0.13))

  useEffect(() => {
    loadDefaultMarker()
  }, [])

  useEffect(() => {
    if (!isEqual(localPanelSize, panelSize)) {
      setLocalPanelSize(panelSize)
    }
  }, [panelSize])
  
  useEffect(() => {
    // sort out the mapping messages, since we actually may also receive turn markers
    const mappingMessages = messages.filter((message: Message) => {
      if (message.messageType !== INFO_MESSAGE_CLIPPED) {
        const custMessage = message as MappingMessage | MappingMessageDelta
        return custMessage.messageType === MAPPING_MESSAGE || custMessage.messageType === MAPPING_MESSAGE_DELTA
      } else return false
    }) 
    if (mappingMessages.length) {
      const mappingMessage = mappingMessages.find((msg: Message) => msg.messageType === MAPPING_MESSAGE)
      if (mappingMessage) {
        if (mappingMessage.messageType === MAPPING_MESSAGE) {
          const baseMappingMessage = cloneDeep(mappingMessage as MappingMessage)

          // keep the mapping message as original for generating patch later
          if (!lastMessages.current) {
            lastMessages.current = cloneDeep(baseMappingMessage)
          }
          const basedFeatureCollection = lastMessages.current.featureCollection
          // find latest delta message based on mapping message id
          const deltaMessages: MappingMessageDelta = mappingMessages.find((msg: Message) => msg.messageType === MAPPING_MESSAGE_DELTA && get(msg, 'since', '') === baseMappingMessage._id)
          if (deltaMessages?.delta.length && !isAppliedPatch(baseMappingMessage, deltaMessages)) {
            const cloneBaseCollection = cloneDeep(basedFeatureCollection)
            // apply latest delta message into original mapping message's feature collection
            baseMappingMessage.featureCollection = applyPatch(cloneBaseCollection, deltaMessages)
          }
          setFilterFeatureIds(getAllFeatureIds(baseMappingMessage.featureCollection))
          setFeatureCollection(baseMappingMessage.featureCollection)
        }
      }
    } else {
      setFeatureCollection(undefined)
    }
  }, [messages])

  useEffect(() => {
    if (channel) {
      const rendererObjects: Array<BaseRenderer> = channel.renderers
      const renList = rendererObjects.map((baseMessage: BaseRenderer) => CoreRendererHelper.from(baseMessage.type))
      setRenderers(renList)
    } else {
      setRenderers([])
    }
  }, [channel])

  useEffect(() => {
    if (pendingCreate) {
      const feature = mapEventToFeatures(pendingCreate)
      if (feature && featureCollection && featureCollection.features) {
        const found = featureCollection.features.find(f => f.properties?.id === feature.properties?.id)
        if (!found) {
          const cloneFeatureCollection = cloneDeep(featureCollection)
          cloneFeatureCollection.features.push(feature)
          saveNewMessage(cloneFeatureCollection)
        }
      }
      setPendingCreate(null) 
    }
  }, [pendingCreate])
  
  const isAppliedPatch = (message: MappingMessage, deltaMessage: MappingMessageDelta) => {
    return message.featureCollection.features.some(f => {
      return deltaMessage.delta.some((dtMsg: any) => get(f, 'properties.id', '') === get(dtMsg, 'value.properties.id', ''))
    })
  }

  const onCreate = (e: PM.ChangeEventHandler) => {
    setPendingCreate(e)
  }

  const saveNewMessage = (newFeatureCollection: FeatureCollection<Geometry, GeoJsonProperties>) => {
    if (newFeatureCollection) {
      const timestamp = new Date().toISOString()
      const details: MessageDetails = {
        channel: channel.uniqid,
        from: {
          force: playerForce.name,
          forceColor: playerForce.color,
          roleId: playerRole.uniqid,
          roleName: playerRole.name,
          iconURL: ''
        },
        timestamp: timestamp,
        turnNumber: 1
      }

      if (lastMessages.current) {
        // generating path from original message with latest feature collection
        const delta = generatePatch(lastMessages.current.featureCollection, newFeatureCollection)
        const deltaMessage: MappingMessageDelta = {
          _id: new Date().toISOString(),
          messageType: MAPPING_MESSAGE_DELTA,
          details,
          since: lastMessages.current._id,
          delta
        }
        postBack(deltaMessage)
      } else {
        const mappingMessage: MappingMessage = {
          _id: new Date().toISOString(),
          messageType: MAPPING_MESSAGE,
          details,
          featureCollection: newFeatureCollection
        }
        postBack(mappingMessage)
      }
    }
  }

  /** add any additional properties for this renderer */
  const insertMissingProps = (props: BaseProperties) => {
    // find the renderer for this feature
    const thisRenderer: BaseRenderer = channel.renderers.find((renderer) => renderer.type === props._type)
    if (thisRenderer) {
      const theseProps = thisRenderer.additionalProps
      // insert missing items from theseProps into props
      theseProps.forEach(p => {
        if (!props[p.id]) {
          // item missing, see what type it is
          switch (p.type) {
            case PROPERTY_ENUM:
              props[p.id] = p.choices[0]
              break
            case PROPERTY_NUMBER:
              props[p.id] = 0
              break
            case PROPERTY_STRING:
              props[p.id] = p.description || 'pending'
              break
          }
        }
      })
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
        insertMissingProps(props)
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
        const props: MilSymProperties = {
          _type: RENDERER_MILSYM,
          sidc: 'SFG-UCI----D',
          size: 'M',
          health: 100,
          ...commonProps
        }

        // add any other extra props for this feature type
        insertMissingProps(props)

        return {
          type: 'Feature',
          properties: props,
          geometry: {
            coordinates: [loc.lng, loc.lat],
            type: 'Point'
          }
        }
      }
      case 'Text': {
        const loc = (e as any).layer._latlng as L.LatLng
        const props: any = {
          _type: RENDERER_CORE,
          _externalType: 'Text', // GeoJsonObject does not have geometry.type = 'Text' so adding an indicator in property
          fontSize: DEFAULT_FONT_SIZE,
          padding: DEFAULT_PADDING,
          ...commonProps,
          label: get(e, 'target.options.text', playerForce.name) // store value
        }
        insertMissingProps(props as BaseProperties)
        return {
          type: 'Feature',
          properties: props,
          geometry: { // remove this makes the pointToLayer broken 
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

  const onShowText = (showLabels: boolean) => {
    setShowLabels(showLabels)
  }

  const onRemoved = (id: string) => {
    if (featureCollection && featureCollection.features) {
      const filterFeatures = featureCollection.features.filter(f => '' + f.properties?.id !== '' + id)
      featureCollection.features = filterFeatures
      const cloneFeatureCollection = cloneDeep(featureCollection)
      saveNewMessage(cloneFeatureCollection)
    }
  }

  const onEdited = (id: number | string, value: string) => {
    if (featureCollection && featureCollection.features) {
      const cloneFeatureCollection = cloneDeep(featureCollection)
      const idx = cloneFeatureCollection.features.findIndex(f => f.properties?.id === id)
      if (idx !== -1 && value) {
        const feature = cloneFeatureCollection.features[idx]
        if (feature.properties) {
          feature.properties.label = value
          saveNewMessage(cloneFeatureCollection)
        }
      }
    }
  }

  const onDragged = (id: number | string, latLngs: LatLng | LatLng[] | LatLng[][]) => {
    if (featureCollection && featureCollection.features) {
      const cloneFeatureCollection = cloneDeep(featureCollection)
      const idx = cloneFeatureCollection.features.findIndex(f => f.properties?.id === id)
      if (idx !== -1 && latLngs) {
        const feature = cloneFeatureCollection.features[idx]
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
        saveNewMessage(cloneFeatureCollection)
      }
    }
  }

  const getUnionRendererProps = (): PropertyType[] => {
    const rendererObjects: BaseRenderer[] = channel.renderers
    const flatMap = flatten(rendererObjects.map(r => [...r.baseProps, ...r.additionalProps]))

    if (featureCollection && featureCollection.features) {
      flatMap.push({
        choices: uniq(featureCollection.features.filter(f => f.geometry.type).map(f => f.geometry.type)),
        id: 'shapeType',
        label: 'Geometry Type',
        type: 'EnumProperty'
      })
    }

    return unionBy(flatMap, 'id')
  }

  return <MappingProvider value={mappingProviderValue}>
    <Box className={styles.container}>
      {!checked && <Button variant='contained' onClick={() => setChecked(true)}>
        <FontAwesomeIcon icon={faCircleArrowRight} />
      </Button>}
      <Slide direction='right' in={checked} mountOnEnter timeout={500}>
        <Box className={styles['slide-container']}>
          <PanelGroup direction="horizontal" >
            <Panel
              defaultSizePercentage={35}
              minSizePercentage={35}
              style={{ pointerEvents: 'all' }}
            >
              <MappingPanel onClose={() => setChecked(false)} features={featureCollection} rendererProps={getUnionRendererProps()} onSave={saveNewMessage} selected={selectedFeature} onSelect={setSelectedFeature} forceStyles={forceStyles}/>
            </Panel>
            <ResizeHandle direction='horizontal' className={styles['resize-handler']} />
            <Panel
              defaultSizePercentage={65}
              style={{ pointerEvents: 'none' }}
            >
            </Panel>
          </PanelGroup>
        </Box>
      </Slide>
      <MapContainer bounds={bounds} zoom={13} scrollWheelZoom={true} className={styles['map-container']} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> 
        <MapControls onCreate={onCreate} onChange={onChange} onShowLabels={onShowText}/>
        <LayerGroup>
          {
            featureCollection && renderers.map((Component, idx) => 
              <Component 
                onRemoved={onRemoved} 
                key={idx + featureCollection.features.length} 
                features={featureCollection} 
                onDragged={onDragged} 
                onEdited={onEdited} 
                onSelect={setSelectedFeature} 
                selected={selectedFeature}
                showLabels={showLabels} 
                forceStyles={forceStyles}
              />) 
          }
        </LayerGroup>
      </MapContainer>
    </Box>
  </MappingProvider>
}

export default CoreMapping
