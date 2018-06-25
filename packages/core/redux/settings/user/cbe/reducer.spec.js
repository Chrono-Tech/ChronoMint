/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import CBEModel from '../../../../models/CBEModel'
import * as a from './actions'
import reducer from './reducer'

const cbe = new CBEModel({ address: '0x123', name: 'Test' })

let list = new Immutable.Map()
list = list.set(cbe.id(), cbe)

describe('settings cbe reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      list: new Immutable.Map(),
      selected: new CBEModel(),
      isFetched: false,
      isLoading: false,
    })
  })

  it('should handle CBE_LIST', () => {
    expect(reducer([], { type: a.CBE_LIST, list })).toEqual({
      list,
      isFetching: false,
      isFetched: true,
    })
  })

  it('should handle CBE_FORM', () => {
    expect(reducer([], { type: a.CBE_FORM, cbe })).toEqual({
      selected: cbe,
    })
  })

  it('should handle CBE_SET', () => {
    expect(reducer({ list: new Immutable.Map() }, { type: a.CBE_SET, cbe })).toEqual({
      list,
    })
  })

  it('should handle CBE_REMOVE', () => {
    expect(reducer({ list }, { type: a.CBE_REMOVE, cbe })).toEqual({
      list: new Immutable.Map(),
    })
  })
})
