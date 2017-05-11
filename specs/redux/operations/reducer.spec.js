import { Map } from 'immutable'
import reducer from '../../../src/redux/operations/reducer'

describe('operations', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      isFetching: false,
      isReady: false,
      list: new Map(),
      required: null,
      toBlock: null
    })
  })
})
