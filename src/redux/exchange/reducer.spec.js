import Immutable from 'immutable'
import TokenModel from 'models/tokens/TokenModel'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import ExchangesCollection from 'models/exchange/ExchangesCollection'
import TokensCollection from 'models/tokens/TokensCollection'
import * as a from './actions'
import reducer, { initialState } from './reducer'

describe('assetsManager reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('sould handle EXCHANGE_GET_ORDERS_START', () => {
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_GET_ORDERS_START,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_GET_ORDERS_FINISH', () => {
    const exchange = new ExchangeOrderModel({})
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_GET_ORDERS_FINISH,
        exchanges: new ExchangesCollection().add(exchange),
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_SET_FILTER', () => {
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_SET_FILTER,
        filter: new Immutable.Map({
          symbol: 'TIME',
        }),
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_GET_DATA_START', () => {
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_GET_DATA_START,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_GET_DATA_FINISH', () => {
    const assetSymbols = [ 'TIME' ]
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_GET_DATA_FINISH,
        assetSymbols,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_MIDDLEWARE_DISCONNECTED', () => {
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_MIDDLEWARE_DISCONNECTED,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_GET_TOKENS_LIST_START', () => {
    const token = new TokenModel({})
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_GET_TOKENS_LIST_START,
        tokens: new TokensCollection().add(token),
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_GET_TOKENS_LIST_FINISH', () => {
    const token = new TokenModel({})
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_GET_TOKENS_LIST_FINISH,
        tokens: new TokensCollection().add(token),
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_REMOVE_FOR_OWNER', () => {
    const exchange = new ExchangeOrderModel({ address: 'test' })
    const state = initialState.exchangesForOwner(new ExchangesCollection().add(exchange))
    expect(
      reducer(state, {
        type: a.EXCHANGE_REMOVE_FOR_OWNER,
        exchange: exchange,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_UPDATE_FOR_OWNER', () => {
    const exchange = new ExchangeOrderModel({ address: 'test' })
    const state = initialState.exchangesForOwner(new ExchangesCollection().add(exchange))
    expect(
      reducer(state, {
        type: a.EXCHANGE_REMOVE_FOR_OWNER,
        exchange: exchange,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_UPDATE', () => {
    const exchange = new ExchangeOrderModel({ address: 'test' })
    const state = initialState.exchangesForOwner(new ExchangesCollection().add(exchange))
    expect(
      reducer(state, {
        type: a.EXCHANGE_UPDATE,
        exchange: exchange,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_EXCHANGES_LIST_GETTING_START', () => {
    const exchange = new ExchangeOrderModel({ address: 'test' })
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_EXCHANGES_LIST_GETTING_START,
        exchanges: new ExchangesCollection().add(exchange),
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_EXCHANGES_LIST_GETTING_FINISH', () => {
    const exchange = new ExchangeOrderModel({ address: 'test' })
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_EXCHANGES_LIST_GETTING_FINISH,
        exchanges: new ExchangesCollection().add(exchange),
        lastPages: 1,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_SET_PAGES_COUNT', () => {
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_SET_PAGES_COUNT,
        count: 1,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_GET_OWNERS_EXCHANGES_START', () => {
    const exchange = new ExchangeOrderModel({ address: 'test' })
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_GET_OWNERS_EXCHANGES_START,
        exchangesForOwner: new ExchangesCollection().add(exchange),
      }),
    ).toMatchSnapshot()
  })

  it('sould handle EXCHANGE_GET_OWNERS_EXCHANGES_FINISH', () => {
    const exchange = new ExchangeOrderModel({ address: 'test' })
    expect(
      reducer(undefined, {
        type: a.EXCHANGE_GET_OWNERS_EXCHANGES_FINISH,
        exchanges: new ExchangesCollection(),
      }),
    ).toMatchSnapshot()
  })
})
