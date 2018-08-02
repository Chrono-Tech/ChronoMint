/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import contractsManagerDAO from '../../dao/ContractsManagerDAO'
import tokenService from '../../services/TokenService'
import MainWalletModel from '../../models/wallet/MainWalletModel'
import ExchangesCollection from '../../models/exchange/ExchangesCollection'
import BigNumber from 'bignumber.js'
import { WALLET_ALLOWANCE } from '../mainWallet/actions'
import { mainTransferc } from '../wallets/actions'
import Immutable from 'immutable'
import networkService from '@chronobank/login/network/NetworkService'
import exchangeService from '../../services/ExchangeService'
import { DUCK_SESSION } from '../session/actions'
import { accounts, mockStore } from 'specsInit'
import ExchangeOrderModel from '../../models/exchange/ExchangeOrderModel'
import ExchangeModel from '../../models/exchange/ExchangeModel'
import TokensCollection from '../../models/tokens/TokensCollection'
import TokenModel from '../../models/tokens/TokenModel'
import { DUCK_TOKENS } from '../tokens/constants'
import ERC20ManagerDAO, { EVENT_NEW_ERC20_TOKEN } from '../../dao/ERC20ManagerDAO'
import * as a from './actions'

let store
const mock = new Immutable.Map({
  [DUCK_SESSION]: {
    account: accounts[0],
  },
  [a.DUCK_EXCHANGE]: new ExchangeModel({ showFilter: false }),
})

describe('Exchange tests', () => {
  let tokens = new TokensCollection()
  let exchange = null
  store = mockStore(mock)
  networkService.connectStore(store)

  it('should get exchange data', async (done: Function) => {
    const erc20: ERC20ManagerDAO = await contractsManagerDAO.getERC20ManagerDAO()
    erc20
      .on(EVENT_NEW_ERC20_TOKEN, async (token: TokenModel) => {
        if (token.symbol() === 'TIME') {
          tokenService.createDAO(token)
          tokens = tokens.add(token)
          store = mockStore(mock.set(DUCK_TOKENS, tokens))
          await store.dispatch(a.getExchange())
          const actions = store.getActions()
          expect(actions).toMatchSnapshot()
          done()
        }
      })
      .fetchTokens()
  })

  it('should get exchanges for owner', async (done: Function) => {
    const testMock = mock.set(a.DUCK_EXCHANGE, new ExchangeModel())
    const tesstStore = mockStore(testMock)
    networkService.connectStore(tesstStore)
    await tesstStore.dispatch(a.getExchangesForOwner())
    const actions = tesstStore.getActions()
    expect(actions[0].type).toEqual(a.EXCHANGE_GET_OWNERS_EXCHANGES_START)
    expect(actions[1].type).toEqual(a.EXCHANGE_GET_OWNERS_EXCHANGES_FINISH)
    expect(actions[1].exchanges.size()).toEqual(jasmine.any(Number))
    done()
  })

  it('should create createExchange', async (done: Function) => {
    const newExchange = new ExchangeOrderModel({
      buyPrice: new BigNumber(1),
      sellPrice: new BigNumber(1),
      symbol: 'TIME',
    })
    exchangeService.subscribeToCreateExchange(accounts[0])
    await exchangeService.on('ExchangeCreated', async (tx: Object) => {
      expect({
        symbol: tx.args.symbol,
      }).toMatchSnapshot()

      exchange = new ExchangeOrderModel({
        address: tx.args.exchange,
        symbol: 'TIME',
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
    expect(actions[0].allowance.id()).toEqual(`${exchange.address()}-${exchange.symbol()}`)
    done()
  })

  it('should get exchanges count', async (done: Function) => {
    store.clearActions()
    await store.dispatch(a.getExchangesCount())
    const actions = store.getActions()
    expect(actions[0].type).toEqual(a.EXCHANGE_SET_PAGES_COUNT)
    expect(actions[0].count).toEqual(jasmine.any(Number))
    done()
  })

  it('should get next page', async (done: Function) => {
    store.clearActions()
    await store.dispatch(a.getNextPage())
    const actions = store.getActions()
    expect(actions[0].type).toEqual(a.EXCHANGE_EXCHANGES_LIST_GETTING_START)
    expect(actions[1].type).toEqual(a.EXCHANGE_EXCHANGES_LIST_GETTING_FINISH)
    expect(actions[1].exchanges.size()).toEqual(jasmine.any(Number))
    done()
  })

  it('should update exchange in redux', async (done: Function) => {
    const testMock = mock.set(
      a.DUCK_EXCHANGE,
      new ExchangeModel({
        exchanges: new ExchangesCollection().add(exchange),
        exchangesForOwner: new ExchangesCollection().add(exchange),
      }),
    )
    const testStore = mockStore(testMock)
    networkService.connectStore(testStore)

    await testStore.dispatch(a.updateExchange(exchange))
    const actions = testStore.getActions()
    expect(actions[0].type).toEqual(a.EXCHANGE_UPDATE_FOR_OWNER)
    expect(actions[1].type).toEqual(a.EXCHANGE_UPDATE)
    done()
  })

  it.skip('should withdraw from exchange', async (done: Function) => {
    store.clearActions()
    const token = tokens.getBySymbol('TIME')
    const address = exchange.address()

    await store.dispatch(mainTransfer(null, token, '10', address))

    const testMock = mock.set(a.DUCK_EXCHANGE, new ExchangeModel({ tokens }))
    store = mockStore(testMock)
    networkService.connectStore(store)
    await store.dispatch(a.getExchangesForOwner())

    const wallet = new MainWalletModel({
      address: accounts[0],
      tokens: new Immutable.Map({ TIME: token }),
    })
    exchangeService.subscribeToExchange(address)
    await exchangeService.on('WithdrawTokens', (tx) => {
      expect(tx.exchange).toEqual(address)
      done()
    })
    await store.dispatch(a.withdrawFromExchange(exchange, wallet, '10', 'TIME'))
  })

  it('should get exchange from state', (done: Function) => {
    let state = new ExchangeModel({
      exchanges: new ExchangesCollection().add(exchange),
      exchangesForOwner: new ExchangesCollection().add(exchange),
    })
    const addresss = exchange.address()
    let exchangeFromState = a.getExchangeFromState(state, addresss)
    expect(exchangeFromState).toEqual(exchange)
    exchangeFromState = a.getExchangeFromState(state.exchanges(new ExchangesCollection()), addresss)
    expect(exchangeFromState).toEqual(exchange)
    done()
  })

  it('should make watchers for exchange', async (done: Function) => {
    try {
      await store.dispatch(a.watchExchanges())
      done()
    } catch (e) {
      done.fail()
    }
  })
})
