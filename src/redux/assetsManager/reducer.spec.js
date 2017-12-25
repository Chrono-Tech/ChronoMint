import Immutable from 'immutable'
import TokenModel from 'models/tokens/TokenModel'
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

  it('should handle GET_MANAGERS_FOR_TOKEN_LOADING', () => {
    expect(
      reducer(null, {
        type: a.GET_MANAGERS_FOR_TOKEN_LOADING,
      }),
    ).toEqual({
      managersForTokenLoading: true,
    })
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

  it('should handle GET_TOKENS', () => {
    const map = new Immutable.Map({ a: 1, b: 2 })
    const result = reducer(null, {
      type: a.GET_TOKENS,
      payload: {
        tokensMap: map,
        assets: [ 1, 2, 3, 4 ],
      },
    })
    expect(result).toMatchSnapshot()
  })

  it('should handle SET_TOKEN', () => {
    const map = new Immutable.Map({ aaa: new TokenModel(), bbb: new TokenModel() })
    const mapAciont = new Immutable.Map({ ccc: new TokenModel() })
    const result = reducer(
      {
        tokensMap: map,
      },
      {
        type: a.SET_TOKEN,
        payload: {
          tokensMap: mapAciont,
          assets: [ 1, 2 ],
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  it('should handle GET_MANAGERS_FOR_TOKEN', () => {
    const map = new Immutable.Map({ LHT: new TokenModel({ managersList: [ 1 ] }) })
    const result = reducer(
      {
        tokensMap: map,
      },
      {
        type: a.GET_MANAGERS_FOR_TOKEN,
        payload: {
          symbol: 'LHT',
          managersForAssetSymbol: [ 1, 2, 3 ],
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  it('should handle SET_TOTAL_SUPPLY', () => {
    const token = new TokenModel({ symbol: 'LHT', address: '1234', totalSupply: 5 })
    const result = reducer(
      {
        tokensMap: new Immutable.Map({ LHT: token }),
        assets: {
          test: {
            totalSupply: 1,
          },
        },
      },
      {
        type: a.SET_TOTAL_SUPPLY,
        payload: {
          token: token,
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  it('should handle SET_IS_REISSUABLE', () => {
    const token = new TokenModel({ symbol: 'LHT' })
    const result = reducer(
      {
        tokensMap: new Immutable.Map({ LHT: token }),
      },
      {
        type: a.SET_IS_REISSUABLE,
        payload: {
          isReissuable: true,
          symbol: 'LHT',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  it('should handle SET_FEE', () => {
    const token = new TokenModel({ symbol: 'LHT' })
    const result = reducer(
      {
        tokensMap: new Immutable.Map({ LHT: token }),
      },
      {
        type: a.SET_FEE,
        payload: {
          fee: 1,
          withFee: true,
          symbol: 'LHT',
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  it('should handle SET_NEW_MANAGERS_LIST', () => {
    const token = new TokenModel({ symbol: 'LHT' })
    const result = reducer(
      {
        tokensMap: new Immutable.Map({ LHT: token }),
      },
      {
        type: a.SET_NEW_MANAGERS_LIST,
        payload: {
          managers: [ 'test', 'test1', 'test2' ],
          managersList: [ 'test', 'test1', 'test2' ],
          symbol: 'LHT',
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
