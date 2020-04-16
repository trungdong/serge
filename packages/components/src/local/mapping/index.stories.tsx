import React from 'react'
import { withKnobs, number } from '@storybook/addon-knobs'

// Import component files
import Mapping from './index'
import docs from './README.md'
import AssetIcon from '../asset-icon'
import { HexGrid } from '../hex-grid'

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
  url: '/tiles/{z}/{x}/{y}.png',
  attribution: 'Generated by QTiles'
}

const OSMTileLayer = {
  url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
  attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>'
}

export const Default: React.FC = () => <Mapping
  bounds = {bounds}
  tileLayer = {LocalTileLayer}
/>

export const WithMarker: React.FC = () => <Mapping
  bounds = {bounds}
  tileLayer = {LocalTileLayer}
>
  <AssetIcon position={[13.298034302, 43.0488191271]} type="agi" force="blue" tooltip="Tooltip for marker"/>
</Mapping>

const hexGridLabel = 'Tile Size'
const hexGridDefaultValue = 2
const hexGridOptions = {
  range: true,
  min: 1,
  max: 15,
  step: 1
}

export const WithGrid: React.FC = () => <Mapping
  bounds = {bounds}
  tileLayer = {LocalTileLayer}
>
  <HexGrid tileSize={number(hexGridLabel, hexGridDefaultValue, hexGridOptions)} width={24} height={21} origin={[14.1166, 42.4166]} />
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

export const OpenStreetMap: React.FC = () => <Mapping
  bounds = {bounds}
  tileLayer = {OSMTileLayer}
/>
