/* global it expect */

import React from 'react'
import L from 'leaflet'
import { mount } from 'enzyme'

import HexGrid from './index'
import Mapping from '../mapping'

const bounds = {
  imageTop: 14.194809302,
  imageLeft: 42.3558566271,
  imageRight: 43.7417816271,
  imageBottom: 12.401259302
}


const topLeft = L.latLng(14.194809302, 42.3558566271)

const bottomRight = L.latLng(12.401259302, 43.7417816271)


const LocalTileLayer = {
  url: '/tiles/{z}/{x}/{y}.png',
  attribution: 'Generated by QTiles'
}

it('Mapping renders correctly with AssetIcon', () => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  // Using enzyme's 'mount' to solve issues with Leaflet requiring access to the DOM and other features not
  // provided by react.render.
  const tree = mount(<Mapping
    bounds = {bounds}
    tileLayer = {LocalTileLayer}
  >
    <HexGrid
      tileRadiusMins={0.0416666}
      topLeft={topLeft}
      bottomRight={bottomRight}
    />
  </Mapping>, { attachTo: div })

  expect(tree).toMatchSnapshot()
})
