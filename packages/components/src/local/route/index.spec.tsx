/* global it expect */
import React from 'react'
import { mount } from 'enzyme'

import Mapping from '../mapping'
import { Phase } from '@serge/config'
import { Route } from './'

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

const history: any = []

const plannedTurns: any = [
  {
    route: [
      'H00',
      'H01',
      'H02',
      'H03'
    ],
    status: {
      speedKts: 20,
      state: 'Transiting'
    },
    turn: 2
  },
  {
    route: [
      'I04',
      'I05',
      'I06',
      'I06'
    ],
    status: {
      speedKts: 20,
      state: 'Transiting'
    },
    turn: 3
  },
  {
    route: [
      'I07',
      'I08',
      'I09',
      'I10'
    ],
    status: {
      speedKts: 20,
      state: 'Transiting'
    },
    turn: 4
  },
  {
    route: [
      'I11',
      'J11',
      'J12',
      'J13'
    ],
    status: {
      speedKts: 20,
      state: 'Transiting'
    },
    turn: 5
  }
]

it('Mapping renders correctly with HexGrid', () => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  // Using enzyme's 'mount' to solve issues with Leaflet requiring access to the DOM and other features not
  // provided by react.render.
  const tree = mount(<Mapping
    bounds = {bounds}
    tileLayer = {LocalTileLayer}
    tileDiameterMins={5}
    forces={[{}]}
    playerForce={'Blue'}
    phase={Phase.Planning}
    >
      <Route name={'alpha'} location={'J2'} history={history} planned={plannedTurns} 
        trimmed={false} color={'#f00'} />
  </Mapping>, { attachTo: div })

  expect(tree).toMatchSnapshot()
})
