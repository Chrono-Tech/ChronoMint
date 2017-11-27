import ExchangesCollection from 'models/exchange/TokensCollection'
import BigNumber from 'bignumber.js'
import { WALLET_ALLOWANCE } from 'redux/mainWallet/actions'
import Immutable from 'immutable'
import networkService from 'Login/redux/network/actions'
import exchangeService from 'services/ExchangeService'
import { DUCK_SESSION } from 'redux/session/actions'
import { accounts, mockStore } from 'specsInit'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import ExchangeModel from 'models/exchange/ExchangeModel'
import * as a from './actions'

let store
const mock = new Immutable.Map({
  [DUCK_SESSION]: {
    account: accounts[0],
  },
  [a.DUCK_EXCHANGE]: new ExchangeModel({}),
})

describe('Exchange tests', () => {
  store = mockStore(mock)
  networkService.connectStore(store)

  let tokens = null
  let exchange = null
  it('should get tokens', async (done: Function) => {
    await store.dispatch(a.getTokenList())
    const actions = store.getActions()
    expect(actions[0].type).toEqual(a.EXCHANGE_GET_TOKENS_LIST_START)
    expect(actions[1].type).toEqual(a.EXCHANGE_GET_TOKENS_LIST_FINISH)
    expect(actions[1].tokens.size()).toEqual(2)
    tokens = actions[1].tokens
    done()
  })

  it.skip('should get exchange data', async (done: Function) => {
    await store.dispatch(a.getExchange())
    const actions = store.getActions()
    expect(actions[0].type).toEqual(a.EXCHANGE_GET_DATA_START)
    expect(actions[1].type).toEqual(a.EXCHANGE_GET_TOKENS_LIST_START)
    expect(actions[2].type).toEqual(a.EXCHANGE_GET_TOKENS_LIST_FINISH)
    expect(actions[2].tokens.size()).toEqual(2)
    expect(actions[3].type).toEqual(a.EXCHANGE_SET_PAGES_COUNT)
    expect(actions[3].count).toEqual(0)
    expect(actions[4].type).toEqual(a.EXCHANGE_GET_OWNERS_EXCHANGES_START)
    expect(actions[5].type).toEqual(a.EXCHANGE_MIDDLEWARE_DISCONNECTED)
    expect(actions[6].type).toEqual(a.EXCHANGE_GET_DATA_FINISH)
    expect(actions[7].type).toEqual(a.EXCHANGE_EXCHANGES_LIST_GETTING_START)
    done()
  })

  it('should get exchanges for owner', async (done: Function) => {
    const testMock = mock.set(a.DUCK_EXCHANGE, new ExchangeModel({ tokens }))
    store = mockStore(testMock)
    networkService.connectStore(store)
    await store.dispatch(a.getExchangesForOwner())
    const actions = store.getActions()
    expect(actions[0].type).toEqual(a.EXCHANGE_GET_OWNERS_EXCHANGES_START)
    expect(actions[1].type).toEqual(a.EXCHANGE_GET_OWNERS_EXCHANGES_FINISH)
    expect(actions[1].exchanges.size()).toEqual(0)
    done()
  })

  it('should create createExchange', async (done: Function) => {
    const testMock = mock.set(
      a.DUCK_EXCHANGE,
      new ExchangeModel({
        tokens,
        showFilter: false,
      }),
    )
    store = mockStore(testMock)
    networkService.connectStore(store)

    const newExchange = new ExchangeOrderModel({
      buyPrice: new BigNumber(1),
      sellPrice: new BigNumber(1),
      symbol: 'TIME',
    })
    exchangeService.subscribeToCreateExchange(accounts[0])
    await exchangeService.on('ExchangeCreated', async (tx: Object) => {
      expect({
        buyPrice: tx.args.buyPrice,
        sellPrice: tx.args.sellPrice,
        symbol: tx.args.symbol,
      }).toMatchSnapshot()

      exchange = new ExchangeOrderModel({
        address: tx.args.exchange,
        symbol: tx.args.symbol,
      })
      done()
    })
    await store.dispatch(a.createExchange(newExchange))
  })

  it('should get allowance for token', async (done: Function) => {
    store.clearActions()
    await store.dispatch(a.getTokensAllowance(exchange))
    const actions = store.getActions()
    expect(actions[0].type).toEqual(WALLET_ALLOWANCE)
    expect(actions[0].token.allowance(exchange.address)).toEqual(new BigNumber(0))
    done()
  })

  it('should get exchanges count', async (done: Function) => {
    store.clearActions()
    await store.dispatch(a.getExchangesCount())
    const actions = store.getActions()
    expect(actions[0].type).toEqual(a.EXCHANGE_SET_PAGES_COUNT)
    expect(actions[0].count).toEqual(1)
    done()
  })

  it('should get next page', async (done: Function) => {
    store.clearActions()
    await store.dispatch(a.getNextPage())
    const actions = store.getActions()
    expect(actions[0].type).toEqual(a.EXCHANGE_EXCHANGES_LIST_GETTING_START)
    expect(actions[1].type).toEqual(a.EXCHANGE_EXCHANGES_LIST_GETTING_FINISH)
    expect(actions[1].exchanges.size()).toEqual(1)
    done()
  })

  it('should update exchange in redux', async (done: Function) => {
    const testMock = mock.set(
      a.DUCK_EXCHANGE,
      new ExchangeModel({
        tokens,
        exchanges: new ExchangesCollection().add(exchange),
        exchangesForOwner: new ExchangesCollection().add(exchange),
      }),
    )
    store = mockStore(testMock)
    networkService.connectStore(store)

    await store.dispatch(a.updateExchange(exchange))
    const actions = store.getActions()
    expect(actions[0].type).toEqual(a.EXCHANGE_UPDATE_FOR_OWNER)
    expect(actions[1].type).toEqual(a.EXCHANGE_UPDATE)
    done()
  })
})
