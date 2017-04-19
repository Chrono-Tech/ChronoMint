import reducer from '../../../src/redux/locs/locForm/reducer'
import {storeLOCAction} from '../../../src/redux/locs/locForm/actions'
import LOCModel from '../../../src/models/LOCModel'

describe('single LOC reducer', () => {
  let state = reducer(undefined, {})

  it('create empty state', () => {
    expect(state).toEqual(null)
  })

  it('store LOC', () => {
    const locModel = new LOCModel({address: 0x10})
    state = reducer(state, storeLOCAction(locModel))
    expect(state).toEqual(locModel)
  })
})
