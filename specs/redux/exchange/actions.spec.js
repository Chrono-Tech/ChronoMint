import * as exchange from '../../../src/redux/exchange/actions'
import { MODAL_SHOW } from '../../../src/redux/ui/modal'
import TransactionModel from '../../../src/models/TransactionModel'
import AssetModel from '../../../src/models/AssetModel'
import { store } from '../../init'
import { Map } from 'immutable'
// TODO Get rid of this class here, it's only for contract DAO
import Web3Converter from '../../../src/utils/Web3Converter'
import ExchangeDAO from '../../../src/dao/ExchangeDAO'
import * as wallet from '../../../src/redux/wallet/actions'

const tx = new TransactionModel({
  hash: '123'
})

const rateLHT = new AssetModel({
  symbol: 'LHT',
  buyPrice: Web3Converter.fromWei(1),
  sellPrice: Web3Converter.fromWei(2)
})

describe('exchange actions', () => {
  it('should dispatch new tx', () => {
    store.dispatch(exchange.exchangeTransaction(tx))
    expect(store.getActions()).toEqual([
      {type: exchange.EXCHANGE_TRANSACTION, tx}
    ])
  })

  it.skip('should fetch transactions', () => {
    return store.dispatch(exchange.getTransactions()).then(() => {
      expect(store.getActions()).toEqual([
        {type: exchange.EXCHANGE_TRANSACTIONS_FETCH},
        {type: exchange.EXCHANGE_TRANSACTIONS, transactions: new Map(), toBlock: 0}
      ])
    })
  })

  it.skip('should fetch rates for LHT', () => {
    return store.dispatch(exchange.getRates()).then(() => {
      expect(store.getActions()).toEqual([
        {type: exchange.EXCHANGE_RATES_FETCH},
        {type: exchange.EXCHANGE_RATES, rate: rateLHT}
      ])
    })
  })

  it('should reject exchange currency and show modal', () => {
    return store.dispatch(exchange.exchangeCurrency(true, 1, rateLHT)).then(() => {
      expect(store.getActions()[0].type).toEqual(MODAL_SHOW)
    })
  })

  it.skip('should update ETH exchange balance', () => {
    return store.dispatch(exchange.updateExchangeETHBalance()).then(() => {
      expect(store.getActions()).toEqual([
        {type: exchange.EXCHANGE_BALANCE_ETH_FETCH},
        {type: exchange.EXCHANGE_BALANCE_ETH, balance: Web3Converter.fromWei(1000)}
      ])
    })
  })

  it.skip('should update LHT exchange balance', () => {
    return store.dispatch(exchange.updateExchangeLHTBalance()).then(() => {
      expect(store.getActions()).toEqual([
        {type: exchange.EXCHANGE_BALANCE_LHT_FETCH},
        {type: exchange.EXCHANGE_BALANCE_LHT, balance: 0}
      ])
    })
  })

  it.skip('should buy token and update balances', () => {
    spyOn(ExchangeDAO, 'buy').and.returnValue(Promise.resolve())

    return store.dispatch(exchange.exchangeCurrency(true, 1, rateLHT)).then(() => {
      expect(store.getActions()).toEqual([
        {type: wallet.WALLET_BALANCE_ETH_FETCH},
        {type: wallet.WALLET_BALANCE_LHT_FETCH},
        {type: exchange.EXCHANGE_BALANCE_LHT_FETCH},
        {type: exchange.EXCHANGE_BALANCE_ETH_FETCH}
      ])
      expect(ExchangeDAO.buy).toHaveBeenCalled()
    })
  })

  it.skip('should sell token and update balances', () => {
    spyOn(ExchangeDAO, 'sell').and.returnValue(Promise.resolve())

    return store.dispatch(exchange.exchangeCurrency(false, 1, rateLHT)).then(() => {
      expect(store.getActions()).toEqual([
        {type: wallet.WALLET_BALANCE_ETH_FETCH},
        {type: wallet.WALLET_BALANCE_LHT_FETCH},
        {type: exchange.EXCHANGE_BALANCE_LHT_FETCH},
        {type: exchange.EXCHANGE_BALANCE_ETH_FETCH}
      ])
      expect(ExchangeDAO.sell).toHaveBeenCalled()
    })
  })
})
