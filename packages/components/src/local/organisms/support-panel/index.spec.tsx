/* global it expect */
import { p9wargame, planningMessages } from '@serge/mocks'
import { noop } from 'lodash'
import React from 'react'
import renderer from 'react-test-renderer'
import SupportPanel from './index'

const planningChannel = p9wargame.data.channels[0]

describe('Support Panel component: ', () => {
  it('renders component correctly', () => {
    const tree = renderer
      .create(<SupportPanel
        forceIcons={[]}
        forceColors={[]}
        forceNames={[]}
        hideForcesInChannel={false}
        messages={planningMessages}
        selectedForce={p9wargame.data.forces.forces[0].uniqid}
        selectedRole={p9wargame.data.forces.forces[0].roles[0].roleId}
        channel={planningChannel}
        forces={[p9wargame.data.forces]}
        onUnread={noop}
        onReadAll={noop}
        onRead={noop}
      />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
