import * as a from '../../../src/redux/exchange/actions'
import * as exchange from '../../../src/redux/exchange/reducer'
import { MODAL_SHOW } from '../../../src/redux/ui/modal'
import TransactionModel from '../../../src/models/TransactionModel'
import AssetModel from '../../../src/models/AssetModel'
import { store } from '../../init'
import { Map } from 'immutable'
import converter from '../../../src/utils/converter'
import ExchangeDAO from '../../../src/dao/ExchangeDAO'
import {
  WALLET_BALANCE_ETH_FETCH,
  WALLET_BALANCE_LHT_FETCH,
  WALLET_CM_BALANCE_LHT_FETCH
} from '../../../src/redux/wallet/reducer'

const tx = new TransactionModel({
  hash: '123'
})

const rateLHT = new AssetModel({
  symbol: 'LHT',
  buyPrice: converter.fromWei(1),
  sellPrice: converter.fromWei(2)
})

describe('exchange actions', () => {
  it('should dispatch new tx', () => {
    store.dispatch(a.exchangeTransaction(tx))
    expect(store.getActions()).toEqual([
      {type: exchange.EXCHANGE_TRANSACTION, tx}
    ])
  })

  it('should fetch transactions', () => {
    return store.dispatch(a.getTransactions()).then(() => {
      expect(store.getActions()).toEqual([
        {type: exchange.EXCHANGE_TRANSACTIONS_FETCH},
        {type: exchange.EXCHANGE_TRANSACTIONS, transactions: new Map(), toBlock: 0}
      ])
    })
  })

  it('should fetch rates for LHT', () => {
    return store.dispatch(a.getRates()).then(() => {
      expect(store.getActions()).toEqual([
        {type: exchange.EXCHANGE_RATES_FETCH},
        {type: exchange.EXCHANGE_RATES, rate: rateLHT}
      ])
    })
  })

  it('should reject exchange currency and show modal', () => {
    return store.dispatch(a.exchangeCurrency(true, 1, rateLHT)).then(() => {
      expect(store.getActions()[0].type).toEqual(MODAL_SHOW)
    })
  })

  it('should buy token and update balances', () => {
    spyOn(ExchangeDAO, 'buy').and.returnValue(Promise.resolve())

    return store.dispatch(a.exchangeCurrency(true, 1, rateLHT)).then(() => {
      expect(store.getActions()).toEqual([
        {type: WALLET_BALANCE_ETH_FETCH},
        {type: WALLET_CM_BALANCE_LHT_FETCH}
      ])
      expect(ExchangeDAO.buy).toHaveBeenCalled()
    })
  })

  it('should update ETH exchange balance', () => {
    return store.dispatch(a.updateExchangeETHBalance()).then(() => {
      expect(store.getActions()).toEqual([
        {type: exchange.EXCHANGE_BALANCE_FETCH},
        {type: exchange.EXCHANGE_BALANCE, balance: 1000}
      ])
    })
  })

  it('should sell token and update balances', () => {
    spyOn(ExchangeDAO, 'sell').and.returnValue(Promise.resolve())

    return store.dispatch(a.exchangeCurrency(false, 1, rateLHT)).then(() => {
      expect(store.getActions()).toEqual([
        {type: WALLET_BALANCE_LHT_FETCH},
        {type: exchange.EXCHANGE_BALANCE_FETCH}
      ])
      expect(ExchangeDAO.sell).toHaveBeenCalled()
    })
  })
})
