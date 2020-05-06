import L from 'leaflet'
import React from 'react'
import { withKnobs, number, radios, boolean, text } from '@storybook/addon-knobs'

/* Import mock data */
import { forces, platformTypes } from '@serge/mocks'

// Import component files
import Mapping from './index'
import docs from './README.md'
import AssetIcon from '../asset-icon'
import Assets from '../assets'
import Route from '../route'
import { HexGrid } from '../hex-grid'

// import data types
import { Phase } from '@serge/config'

export default {
  title: 'local/Mapping',
  component: Mapping,
  decorators: [withKnobs],
  parameters: {
    readme: {
      // Show readme before story
      content: docs
    },
    options: {
      // We have no addons enabled in this story, so the addon panel should be hidden
      showPanel: false
    }
  }
}

const bounds = {
  imageTop: 14.194809302,
  imageLeft: 42.3558566271,
  imageRight: 43.7417816271,
  imageBottom: 12.401259302
}

const LocalTileLayer = {
  url: './tiles/{z}/{x}/{y}.png',
  attribution: 'Generated by QTiles'
}

const OSMTileLayer = {
  url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
  attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>'
}

/**
 * DEFAULT VIEW
 */
export const Default: React.FC = () => <Mapping
  tileDiameterMins = {5}
  bounds = {bounds}
  tileLayer = {LocalTileLayer}
  forces = {forces}
  playerForce = 'Blue'
  platforms = {platformTypes}
  phase = {Phase.Planning}
  mapBar = {false}
/>

/**
 * VIEW WITH MAPPING BAR
 */
export const WithMapBar: React.FC = () => <Mapping
  tileDiameterMins = {5}
  bounds = {bounds}
  tileLayer = {LocalTileLayer}
  forces={forces}
  platforms = {platformTypes}
  phase={Phase.Planning}
  playerForce={radios(label, forceNames, defaultValue)}
>
</Mapping>

/**
 * VIEW WITH SINGLE ASSET
 */
const visLabel = 'Selected'
const visDefaultValue = false

const assetForcelabel = 'Force'
const assetForceNames = {
  Green: 'green',
  Blue: 'blue',
  Red: 'red'
}
const assetForceDefaultValue = 'blue'

const assetTypelabel = 'Type'
const assetTypeNames = {
  Destroyer: 'destroyer',
  MCMV: 'mcmv',
  Unknown: 'unknown',
  AGI: 'agi'
}
const assetTypeDefaultValue = 'agi'

export const WithMarker: React.FC = () => <Mapping
  tileDiameterMins = {5}
  bounds = {bounds}
  tileLayer = {LocalTileLayer}
  forces = {forces}
  playerForce = 'Blue'
  platforms = {platformTypes}
  phase = {Phase.Planning}
  mapBar = {false}
>
  <AssetIcon id="id1" name="Jeffrey" position={L.latLng(13.298034302, 43.0488191271)}
    selected={boolean(visLabel, visDefaultValue)}
    type={radios(assetTypelabel, assetTypeNames, assetTypeDefaultValue)}
    force={radios(assetForcelabel, assetForceNames, assetForceDefaultValue)}
    tooltip="Tooltip for marker" />
</Mapping>

// @ts-ignore TS belives the 'story' property doesn't exist but it does.
WithMarker.story = {
  parameters: {
    options: {
      // This story requires addons but other stories in this component do not
      showPanel: true
    }
  }
}

/**
 * VIEW WITH MULTIPLE ASSETS
 */
const label = 'View As'
const forceNames = {
  White: 'umpire',
  Blue: 'Blue',
  Red: 'Red'
}
const defaultValue = 'Blue'

export const WithAssets: React.FC = () => <Mapping
  tileDiameterMins = {5}
  bounds = {bounds}
  tileLayer = {LocalTileLayer}
  forces={forces}
  playerForce={radios(label, forceNames, defaultValue)}
  platforms = {platformTypes}
  phase = {Phase.Planning}
>
  <Assets />
</Mapping>

// @ts-ignore TS belives the 'story' property doesn't exist but it does.
WithAssets.story = {
  parameters: {
    options: {
      // This story requires addons but other stories in this component do not
      showPanel: true
    }
  }
}

/**
 * VIEW WITH HEX GRID
 */
const hexGridLabel = 'Tile diameter, nm'
const hexGridDefaultValue = 5
const hexGridOptions = {
  range: true,
  min: 1,
  max: 15,
  step: 1
}

export const WithGrid: React.FC = () => <Mapping
  bounds = {bounds}
  tileLayer = {LocalTileLayer}
  tileDiameterMins={number(hexGridLabel, hexGridDefaultValue, hexGridOptions)}
  forces={forces}
  platforms = {platformTypes}
  phase = {Phase.Planning}
  playerForce='Blue'
  mapBar = {false}
>
  <HexGrid />
</Mapping>

// @ts-ignore TS belives the 'story' property doesn't exist but it does.
WithGrid.story = {
  parameters: {
    options: {
      // This story requires addons but other stories in this component do not
      showPanel: true
    }
  }
}

/**
 * VIEW WITH ALLOWABLE CELLS
 */
const allowableOnLabel = 'Show allowable cells'
const allowableDefaultValue = true

const allowableOriginLabel = 'Current location'
const allowableOriginValue = 'F10'

const allowableTerrain = 'Platform terrain constraints'
const allowableTerrainDefault = 'Sea'
const allowableTerrainOptions = {
  Sea: 'Sea',
  Land: 'Land',
  Air: 'Air'
}

const allowableGridLabel = 'Platform range'
const allowableGridDefaultValue = 3
const allowableGridOptions = {
  range: true,
  min: 1,
  max: 6,
  step: 1
}

export const WithAllowableRange: React.FC = () => <Mapping
  bounds = {bounds}
  tileLayer = {LocalTileLayer}
  tileDiameterMins={number(hexGridLabel, hexGridDefaultValue, hexGridOptions)}
  forces={forces}
  platforms = {platformTypes}
  phase = {Phase.Planning}
  playerForce='Blue'
  mapBar = {false}
  planningRangeProp = {number(allowableGridLabel, allowableGridDefaultValue, allowableGridOptions)}
  planningConstraintsProp={ boolean(allowableOnLabel, allowableDefaultValue) ? {
    origin: text(allowableOriginLabel, allowableOriginValue),
    travelMode: radios(allowableTerrain, allowableTerrainOptions, allowableTerrainDefault)
  } : undefined}
>
  <HexGrid />
</Mapping>

// @ts-ignore TS belives the 'story' property doesn't exist but it does.
WithAllowableRange.story = {
  parameters: {
    options: {
      // This story requires addons but other stories in this component do not
      showPanel: true
    }
  }
}

/**
 * VIEW WITH OPEN STREET MAP
 */
export const OpenStreetMap: React.FC = () => <Mapping
  tileDiameterMins = {5}
  bounds = {bounds}
  tileLayer = {OSMTileLayer}
  forces={forces}
  playerForce='Blue'
  platforms = {platformTypes}
  phase = {Phase.Planning}
  mapBar = {false}
/>

/**
 * VIEW ALLOWING GAME PHASE & PLAYER FORCE TO CHANGE
 * (with the intention of verifyin that the correct form is displayed)
 */
const phasesViewLabel = 'View as'
const phasesViewNames = {
  White: 'umpire',
  Blue: 'Blue',
  Red: 'Red'
}
const phaseViewValue = 'Blue'

const phasesPhaseLabel = 'Game phase'
const phasesPhaseNames = {
  Planning: Phase.Planning,
  Adjudication: Phase.Adjudication
}
const phasePhaseValue = Phase.Planning

export const WithPhases: React.FC = () => <Mapping
  tileDiameterMins = {5}
  bounds = {bounds}
  tileLayer = {LocalTileLayer}
  forces={forces}
  playerForce={radios(phasesViewLabel, phasesViewNames, phaseViewValue)}
  platforms = {platformTypes}
  phase={radios(phasesPhaseLabel, phasesPhaseNames, phasePhaseValue)}
>
  <Assets />
</Mapping>

// @ts-ignore TS belives the 'story' property doesn't exist but it does.
WithPhases.story = {
  parameters: {
    options: {
      // This story requires addons but other stories in this component do not
      showPanel: true
    }
  }
}

/**
 * VIEW WITH ASSET ROUTES
 */
// knob bits:
const trimmedLabel = 'Trimmed'
const trimmedDefaultValue = false
const selectedLabel = 'Selected'
const selectedDefaultValue = false

// test data:
const greenForce: any = forces[3]
const platform: any = greenForce.assets[0]
const { plannedTurns, history } = platform

export const WithRoute: React.FC = () => <Mapping
  bounds = {bounds}
  tileLayer = {LocalTileLayer}
  tileDiameterMins={5}
  forces={forces}
  platforms = {platformTypes}
  phase = {Phase.Planning}
  playerForce='Green'
  mapBar = {false}
>
  <HexGrid />
  <Route name={'test'} location={platform.position}
    history={history} planned={plannedTurns} color={'#00f'}
    selected={boolean(selectedLabel, selectedDefaultValue, 'Adjustments')}
    trimmed={boolean(trimmedLabel, trimmedDefaultValue, 'Adjustments')}
  />
</Mapping>

// @ts-ignore TS belives the 'story' property doesn't exist but it does.
WithRoute.story = {
  parameters: {
    options: {
      // This story requires addons but other stories in this component do not
      showPanel: true
    }
  }
}
