import reducer, {LOCS_FETCH_START, LOCS_FETCH_END} from '../../../src/redux/locs/communication'
import {SESSION_CREATE_FETCH} from '../../../src/redux/session/actions'

describe('LOCs Communication reducer', () => {
  let state = reducer(undefined, {})

  it('create empty state', () => {
    expect(state).toEqual({error: false, isFetching: false, isReady: false})
  })

  it('fetching start', () => {
    state = reducer(state, {type: LOCS_FETCH_START})
    expect(state).toEqual({error: false, isFetching: true, isReady: false})
  })

  it('some other action should not change state', () => {
    expect(reducer(state, {type: 'SOME_OTHER_ACTION'})).toEqual(state)
  })

  it('fetching end', () => {
    state = reducer(state, {type: LOCS_FETCH_END})
    expect(state).toEqual({error: false, isFetching: false, isReady: true})
  })

  it('empty state after Session start', () => {
    state = reducer(state, {type: SESSION_CREATE_FETCH})
    expect(state).toEqual({error: false, isFetching: false, isReady: false})
  })
})
