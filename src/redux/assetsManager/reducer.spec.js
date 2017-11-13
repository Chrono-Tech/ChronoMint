import Immutable from 'immutable'
import TokenModel from 'models/TokenModel'
import * as a from './actions'
import reducer, { initialState } from './reducer'

describe('assetsManager reducer', () => {
  it('should return initial state', () => {
    expect(reducer(
      undefined,
      {}
    ))
      .toEqual(initialState)
  })

  it('should handle GET_ASSETS_MANAGER_COUNTS_START', () => {
    expect(reducer(
      null,
      {
        type: a.GET_ASSETS_MANAGER_COUNTS_START,
      }))
      .toEqual({
        assetsManagerCountsLoading: true,
      })
  })

  it('should handle GET_ASSETS_MANAGER_COUNTS', () => {
    expect(reducer(
      null,
      {
        type: a.GET_ASSETS_MANAGER_COUNTS,
        payload: {
          assets: { a: '1' },
          managers: [1, 2, 3, 4],
          platforms:
            [1, 2, 3, 4],
        },
      }))
      .toEqual({
        assetsManagerCountsLoading: false,
        tokensCount: 1,
        managersCount: 4,
        assets: { a: '1' },
        managersList: [1, 2, 3, 4],
        platformsList: [1, 2, 3, 4],
      })
  })

  it('should handle GET_PLATFORMS', () => {
    expect(reducer(
      null,
      {
        type: a.GET_PLATFORMS,
        payload: {
          platforms: [1, 2, 3, 4],
        },
      }))
      .toEqual({
        platformsList: [1, 2, 3, 4],
      })
  })

  it('should handle GET_MANAGERS_FOR_TOKEN_LOADING', () => {
    expect(reducer(
      null,
      {
        type: a.GET_MANAGERS_FOR_TOKEN_LOADING,
      }))
      .toEqual({
        managersForTokenLoading: true,
      })
  })

  it('should handle SELECT_TOKEN', () => {
    expect(reducer(
      null,
      {
        type: a.SELECT_TOKEN,
        payload: {
          symbol: 'LHT',
        },
      }))
      .toEqual({
        selectedToken: 'LHT',
      })
  })

  it('should handle SELECT_PLATFORM', () => {
    expect(reducer(
      null,
      {
        type: a.SELECT_PLATFORM,
        payload: {
          platformAddress: 'test',
        },
      })).toEqual({
      selectedPlatform: 'test',
    })
  })

  it('should handle GET_TOKENS', () => {
    const map = new Immutable.Map({ a: 1, b: 2 })
    expect(reducer(
      null,
      {
        type: a.GET_TOKENS,
        payload: {
          tokensMap: map,
          assets: [1, 2, 3, 4],
        },
      }))
      .toEqual({
        tokensCount: 2,
        tokensMap: map,
        assets: [1, 2, 3, 4],
      })
  })

  it('should handle SET_TOKEN', () => {
    const map = new Immutable.Map({ 'aaa': new TokenModel(), 'bbb': new TokenModel() })
    const map1 = new Immutable.Map({ 'ccc': new TokenModel() })
    const mapRes = new Immutable.Map({ 'aaa': new TokenModel(), 'bbb': new TokenModel(), 'ccc': new TokenModel() })
    expect(reducer(
      {
        tokensMap: map,
      },
      {
        type: a.SET_TOKEN,
        payload: {
          tokensMap: map1,
          assets: [1, 2],
        },
      }))
      .toEqual({
        tokensCount: 3,
        tokensMap: mapRes,
        assets: [1, 2],
      })
  })

  it('should handle GET_MANAGERS_FOR_TOKEN', () => {
    const map = new Immutable.Map({ 'LHT': new TokenModel({ 'managersList': [1] }) })
    expect(reducer(
      {
        tokensMap: map,
      },
      {
        type: a.GET_MANAGERS_FOR_TOKEN,
        payload: {
          symbol: 'LHT',
          managersForAssetSymbol: [1, 2, 3],
        },
      }))
      .toEqual({
        tokensMap: new Immutable.Map({ 'LHT': new TokenModel({ 'managersList': [1, 2, 3] }) }),
        managersForTokenLoading: false,
      })
  })

  it('should handle SET_TOTAL_SUPPLY', () => {
    const token = new TokenModel({ symbol: 'LHT', address: '1234', totalSupply: 5 })
    expect(reducer(
      {
        tokensMap: new Immutable.Map({ 'LHT': token }),
        assets: {
          '1234': {
            totalSupply: 1,
          },
        },
      },
      {
        type: a.SET_TOTAL_SUPPLY,
        payload: {
          token: token,
        },
      }))
      .toEqual({
        'assets': {
          '1234': {
            totalSupply: 5,
          },
        },
        tokensMap: new Immutable.Map({ 'LHT': token }),
      })
  })

  it('should handle SET_IS_REISSUABLE', () => {
    const token = new TokenModel({ symbol: 'LHT' })
    expect(reducer(
      {
        tokensMap: new Immutable.Map({ 'LHT': token }),
      },
      {
        type: a.SET_IS_REISSUABLE,
        payload: {
          isReissuable: true,
          symbol: 'LHT',
        },
      }))
      .toEqual({
        tokensMap: new Immutable.Map({ 'LHT': token.isReissuable(true) }),
      })
  })

  it('should handle SET_FEE', () => {
    const token = new TokenModel({ symbol: 'LHT' })
    expect(reducer(
      {
        tokensMap: new Immutable.Map({ 'LHT': token }),
      },
      {
        type: a.SET_FEE,
        payload: {
          fee: 1,
          withFee: true,
          symbol: 'LHT',
        },
      }))
      .toEqual({
        tokensMap: new Immutable.Map({ 'LHT': token.fee(1).withFee(true) }),
      })
  })

  it('should handle SET_NEW_MANAGERS_LIST', () => {
    const token = new TokenModel({ symbol: 'LHT' })
    expect(reducer(
      {
        tokensMap: new Immutable.Map({ 'LHT': token }),
      },
      {
        type: a.SET_NEW_MANAGERS_LIST,
        payload: {
          managers: [1, 2, 3],
          managersList: [1, 2, 3],
          symbol: 'LHT',
        },
      }))
      .toEqual({
        tokensMap: new Immutable.Map({ 'LHT': token.managersList([1, 2, 3]) }),
        managersList: [1, 2, 3],
        managersCount: 3,
      })
  })

  it('should handle GET_TRANSACTIONS_START', () => {
    expect(reducer(
      null,
      {
        type: a.GET_TRANSACTIONS_START,
      }))
      .toEqual({
        transactionsFetching: true,
      })
  })

  it('should handle GET_TRANSACTIONS_DONE', () => {
    expect(reducer(
      {
        transactionsList: [],
      },
      {
        type: a.GET_TRANSACTIONS_DONE,
        payload: {
          transactionsList: [1, 2, 3, 4, 5],
        },
      }))
      .toEqual({
        transactionsList: [1, 2, 3, 4, 5],
        transactionsFetched: true,
        transactionsFetching: false,
      })
  })

  it('should handle GET_USER_PLATFORMS', () => {
    expect(reducer(
      null,
      {
        type: a.GET_USER_PLATFORMS,
        payload: {
          usersPlatforms: [1, 2, 3, 4, 5],
        },
      }))
      .toEqual({
        usersPlatforms: [1, 2, 3, 4, 5],
        usersPlatformsCount: 5,
      })
  })
})
