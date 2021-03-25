import L from 'leaflet'
import React from 'react'
import { withKnobs, number } from '@storybook/addon-knobs'

/* Import mock data */
import { atlanticForces as forces, platformTypes } from '@serge/mocks'

// Import component files
import Mapping from './index'
import docs from './README.md'
import { HexGrid } from '../hex-grid'
import { Assets } from '../assets'

// import data types
import { Phase } from '@serge/config'

const wrapper: React.FC = (storyFn: any) => <div style={{ height: '1200px' }}>{storyFn()}</div>

export default {
  title: 'local/AtlanticMapping',
  component: Mapping,
  decorators: [withKnobs, wrapper],
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

const bounds = L.latLngBounds([[80, -50.0], [40.0, 45]])

const LocalTileLayer = {
  url: './atlantic_tiles/{z}/{x}/{y}.png',
  attribution: 'Generated by QTiles'
}

const OSMTileLayer = {
  url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
  attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>'
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

export const NaturalEarth: React.FC = () => <Mapping
  bounds={bounds}
  tileLayer={LocalTileLayer}
  tileDiameterMins={number(hexGridLabel, hexGridDefaultValue, hexGridOptions)}
  forces={forces}
  wargameInitiated={true}
  platforms={platformTypes}
  phase={Phase.Planning}
  turnNumber={5}
  playerForce='Blue'
  canSubmitOrders={false}
  mapBar={false}
> <>
    <Assets />
    <HexGrid />
  </>
</Mapping>

export const OpenStreetMap: React.FC = () => <Mapping
  bounds={bounds}
  tileLayer={OSMTileLayer}
  tileDiameterMins={number(hexGridLabel, hexGridDefaultValue, hexGridOptions)}
  forces={forces}
  wargameInitiated={true}
  platforms={platformTypes}
  phase={Phase.Planning}
  turnNumber={5}
  playerForce='Blue'
  canSubmitOrders={false}
  mapBar={false}
>
  <HexGrid />
</Mapping>

// @ts-ignore TS believes the 'story' property doesn't exist but it does.
NaturalEarth.story = {
  parameters: {
    options: {
      // This story requires addons but other stories in this component do not
      showPanel: true
    }
  }
}

// @ts-ignore TS believes the 'story' property doesn't exist but it does.
OpenStreetMap.story = {
  parameters: {
    options: {
      // This story requires addons but other stories in this component do not
      showPanel: true
    }
  }
}
