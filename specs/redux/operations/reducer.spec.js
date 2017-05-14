import { Map } from 'immutable'
import reducer from '../../../src/redux/operations/reducer'

describe('operations', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      isFetching: false,
      isFetched: false,
      list: new Map(),
      required: null,
      adminCount: null,
      toBlock: null
    })
  })
})
