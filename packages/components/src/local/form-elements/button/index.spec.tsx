/* global it expect */

import React from 'react'
import renderer from 'react-test-renderer'

import Button from './index'

it('Button renders correctly', () => {
  const tree = renderer
    .create(<Button disabled={false}/>)
    .toJSON()
  expect(tree).toMatchSnapshot()
})