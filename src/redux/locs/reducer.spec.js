import { Map } from 'immutable'

import * as a from './actions'
import LOCModel from '../../models/LOCModel'
import reducer, { initialState } from './reducer'

const init = {
  locs: new Map({}),
}

const loc1 = new LOCModel({ name: 'loc1' })
const loc2 = new LOCModel({ name: 'loc2' })

describe('locs reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle LOCS_LIST_FETCH', () => {
    expect(reducer({}, { type: a.LOCS_LIST_FETCH }))
      .toEqual({
        isFetching: true,
      })
  })

  it('should handle LOCS_LIST', () => {
    const locs = new Map({ loc1, loc2 })

    expect(reducer(init, { type: a.LOCS_LIST, locs }))
      .toEqual({
        locs,
        isFetching: false,
        isFetched: true,
      })
  })

  it('should handle LOC_CREATE', () => {
    expect(reducer(init, { type: a.LOC_CREATE, loc: loc1 }))
      .toEqual({
        locs: new Map({ loc1 }),
      })
  })

  it('should handle LOC_UPDATE', () => {
    const locs = new Map({ loc1 })
    const updatedLOC = loc1.issued(5)
    expect(reducer({ locs }, { type: a.LOC_UPDATE, loc: updatedLOC }))
      .toEqual({
        locs: new Map({ loc1: updatedLOC }),
      })
  })

  it('should handle LOC_REMOVE', () => {
    const locs = new Map({ loc1, loc2 })
    expect(reducer({ locs }, { type: a.LOC_REMOVE, name: 'loc1' }))
      .toEqual({
        locs: new Map({ loc2 }),
      })
  })

  it('should handle LOC_UPDATE_FILTER', () => {
    expect(reducer({}, { type: a.LOCS_UPDATE_FILTER, filter: 'abc' }))
      .toEqual({
        filter: 'abc',
      })
  })
})
