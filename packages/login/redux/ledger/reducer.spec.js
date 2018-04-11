/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as a from './actions'
import reducer from './reducer'

describe('ledger reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isHttps: false,
      isU2F: false,
      isETHAppOpened: false,
      isFetching: false,
      isFetched: false,
    })
  })

  it('should handle LEDGER_SET_U2F', () => {
    expect(reducer({}, { type: a.LEDGER_SET_U2F, isU2F: true }))
      .toEqual({
        isU2F: true,
      })
  })

  it('should handle LEDGER_SET_ETH_APP_OPENED', () => {
    expect(reducer({}, { type: a.LEDGER_SET_ETH_APP_OPENED, isETHAppOpened: true }))
      .toEqual({
        isETHAppOpened: true,
      })
  })

  it('should handle LEDGER_FETCHING', () => {
    expect(reducer({}, { type: a.LEDGER_FETCHING }))
      .toEqual({
        isFetching: true,
      })
  })

  it('should handle LEDGER_FETCHED', () => {
    expect(reducer({ isFetching: true }, { type: a.LEDGER_FETCHED, isFetched: true }))
      .toEqual({
        isFetched: true,
        isFetching: false,
      })
  })
})
