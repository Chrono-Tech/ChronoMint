/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import TokenModel from '../../../../models/tokens/TokenModel'
import * as a from './actions'
import reducer from './reducer'

const token = new TokenModel({ address: '0x123', symbol: 'TIME' })

describe('settings erc20 reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      list: new Immutable.Map(),
      selected: new TokenModel(),
      formFetching: false,
      isFetched: false,
    })
  })

  it('should handle TOKENS_FORM', () => {
    expect(reducer([], { type: a.TOKENS_FORM, token })).toEqual({
      selected: token,
    })

    expect(reducer([], { type: a.TOKENS_FORM_FETCH, end: true })).toEqual({
      formFetching: false,
    })
  })

  it('should handle TOKENS_FORM_FETCH', () => {
    expect(reducer([], { type: a.TOKENS_FORM_FETCH })).toEqual({
      formFetching: true,
    })

    expect(reducer([], { type: a.TOKENS_FORM_FETCH, end: true })).toEqual({
      formFetching: false,
    })
  })

})
