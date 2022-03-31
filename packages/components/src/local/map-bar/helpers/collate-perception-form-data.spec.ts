/* global it expect */
import collatePerceptionFormData from './collate-perception-form-data'

import platformTypes from '@serge/mocks/platform-types.mock'
import selectedAsset from '@serge/mocks/selected-asset.mock'
import forces from '@serge/mocks/forces.mock'
import { PerceptionFormData, PerceptionFormPopulate, PerceptionFormValues } from '@serge/custom-types'
import { UMPIRE_FORCE } from '@serge/config'

it('contains relevant population results', () => {
  const selected2 = {
    ...selectedAsset,
    uniqid: 'a0pra000100'
  }
  const data: PerceptionFormData | null = collatePerceptionFormData(platformTypes, 'Blue', selected2, forces)
  if (data) {
    const res: PerceptionFormPopulate = data.populate
    expect(res.perceivedForces.length).toEqual(4)
    expect(res.perceivedForces[0]).toEqual({ colour: '#00F', name: 'Blue' })
    expect(res.perceivedForces).toContainEqual({ colour: '#ccc', name: 'Unknown' })
    expect(res.perceivedTypes.length).toEqual(13)
    expect(res.perceivedTypes[0]).toEqual({ name: 'Fishing vessel', uniqid: 'a1' })
  } else {
    expect(false).toBeTruthy()
  }
})

it('contains relevant current results for other force', () => {
  const selected2 = {
    ...selectedAsset,
    uniqid: 'a0pra000100',
    force: 'Red'
  }
  const data: PerceptionFormData | null = collatePerceptionFormData(platformTypes, 'Blue', selected2, forces)
  if (data) {
    const res: PerceptionFormValues = data.values
    expect(res.perceivedForceVal).toEqual('unknown')
    expect(res.perceivedTypeId).toBeUndefined()
    expect(res.perceivedNameVal).toEqual('C065')
  } else {
    expect(false).toBeTruthy()
  }
})

it('contains relevant current results for my force', () => {
  const selected2 = {
    ...selectedAsset,
    uniqid: 'a0pra000100',
    force: 'Blue'
  }
  const data: PerceptionFormData | null = collatePerceptionFormData(platformTypes, 'Blue', selected2, forces)
  if (data) {
    const res: PerceptionFormValues = data.values
    expect(res.perceivedForceVal).toEqual('blue')
    expect(res.perceivedTypeId).toEqual('a3')
    expect(res.perceivedNameVal).toEqual('Dhow-A')
  } else {
    expect(false).toBeTruthy()
  }
})

it('contains relevant current results for umpire force', () => {
  const selected2 = {
    ...selectedAsset,
    uniqid: 'a0pra000100',
    force: 'Blue'
  }
  const data: PerceptionFormData | null = collatePerceptionFormData(platformTypes, UMPIRE_FORCE, selected2, forces)
  if (data) {
    const res: PerceptionFormValues = data.values
    expect(res.perceivedForceVal).toEqual('blue')
    expect(res.perceivedTypeId).toEqual('a3')
    expect(res.perceivedNameVal).toEqual('Dhow-A')
  } else {
    expect(false).toBeTruthy()
  }
})
