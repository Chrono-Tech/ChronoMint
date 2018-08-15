/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as a from './actions'
import reducer, { initialState } from './reducer'

describe('assetsManager reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle GET_ASSETS_MANAGER_COUNTS_START', () => {
    expect(
      reducer(null, {
        type: a.GET_ASSETS_MANAGER_COUNTS_START,
      }),
    ).toEqual({
      assetsManagerCountsLoading: true,
    })
  })

  it('should handle GET_ASSETS_MANAGER_COUNTS', () => {
    expect(
      reducer(null, {
        type: a.GET_ASSETS_MANAGER_COUNTS,
        payload: {
          assets: { a: '1' },
          managers: [ 'test', 'test1', 'test2' ],
          platforms: [ 'test', 'test1', 'test2' ],
        },
      }),
    ).toMatchSnapshot()
  })

  it('should handle GET_PLATFORMS', () => {
    expect(
      reducer(null, {
        type: a.GET_PLATFORMS,
        payload: {
          platforms: [ 'test', 'test1', 'test2' ],
        },
      }),
    ).toMatchSnapshot()
  })

  it('should handle SELECT_TOKEN', () => {
    expect(
      reducer(null, {
        type: a.SELECT_TOKEN,
        payload: {
          symbol: 'LHT',
        },
      }),
    ).toEqual({
      selectedToken: 'LHT',
    })
  })

  it('should handle SELECT_PLATFORM', () => {
    expect(
      reducer(null, {
        type: a.SELECT_PLATFORM,
        payload: {
          platformAddress: 'test',
        },
      }),
    ).toEqual({
      selectedPlatform: 'test',
    })
  })

  it('should handle SET_ASSETS', () => {
    expect(
      reducer(null, {
        type: a.SET_ASSETS,
        payload: {
          assets: {
            'test': 'test',
          },
        },
      }),
    ).toEqual({
      'assets': {
        'test': 'test',
      },
    })
  })

  it('should handle SET_NEW_MANAGERS_LIST', () => {
    const result = reducer(
      null,
      {
        type: a.SET_NEW_MANAGERS_LIST,
        payload: {
          managers: [ 'test', 'test1', 'test2' ],
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  it('should handle GET_TRANSACTIONS_START', () => {
    expect(
      reducer(null, {
        type: a.GET_TRANSACTIONS_START,
      }),
    ).toEqual({
      transactionsFetching: true,
    })
  })

  it('should handle GET_TRANSACTIONS_DONE', () => {
    expect(
      reducer(
        { transactionsList: [] },
        {
          type: a.GET_TRANSACTIONS_DONE,
          payload: {
            transactionsList: [ { txHash: 'test' }, { txHash: 'test1' } ],
          },
        },
      ),
    ).toMatchSnapshot()
  })

  it('should handle GET_USER_PLATFORMS', () => {
    expect(
      reducer(null, {
        type: a.GET_USER_PLATFORMS,
        payload: {
          usersPlatforms: [ 'test', 'test1', 'test2' ],
        },
      }),
    ).toMatchSnapshot()
  })
})
