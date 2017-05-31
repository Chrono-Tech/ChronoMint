import { LOCS_FETCH_START } from '../../../src/redux/locs/list/actions'
import { locs as reducer } from '../../../src/redux/locs/'

describe('LOCs Communication reducer', () => {
  let state = reducer(undefined, {})

  it('create empty state', () => {
    expect(state).toEqual({error: false, isFetching: false, isFetched: false})
  })

  it('fetching start', () => {
    state = reducer(state, {type: LOCS_FETCH_START})
    expect(state).toEqual({error: false, isFetching: true, isFetched: false})
  })

  it('some other action should not change state', () => {
    expect(reducer(state, {type: 'SOME_OTHER_ACTION'})).toEqual(state)
  })
})
