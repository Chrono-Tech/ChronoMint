import reducer, {storeLOCAction} from '../../../src/redux/locs/loc'
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
