import { Map } from 'immutable'
import * as a from '../../../src/redux/wallet/actions'
import reducer from '../../../src/redux/wallet/reducer'

import TransactionModel from '../../../src/models/TransactionModel'

const tx = new TransactionModel({txHash: 'abc', from: '0x0', to: '0x1'})
const tx1 = new TransactionModel({txHash: 'xyz', from: '0x1', to: '0x0'})
let transactions = new Map()
transactions = transactions.set(tx.id(), tx)
let transactions1 = new Map()
transactions1 = transactions1.set(tx1.id(), tx1)

describe('settings cbe reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      time: {
        currencyId: 'TIME',
        balance: null,
        isFetching: false,
        isFetched: false,
        deposit: 0
      },
      lht: {
        currencyId: 'LHT',
        balance: null,
        isFetching: false,
        isFetched: false
      },
      eth: {
        currencyId: 'ETH',
        balance: null,
        isFetching: false,
        isFetched: false
      },
      contractsManagerLHT: {
        currencyId: 'LHT',
        balance: null,
        isFetching: false,
        isSubmitting: false
      },
      isFetching: false,
      isFetched: false,
      transactions: new Map(),
      toBlock: null
    })
  })

  it('should handle WALLET_BALANCE_TIME_FETCH', () => {
    expect(
      reducer([], {type: a.WALLET_BALANCE_TIME_FETCH})
    ).toEqual({
      time: {
        isFetching: true
      }
    })
  })

  it('should handle WALLET_BALANCE_TIME', () => {
    expect(
      reducer([], {type: a.WALLET_BALANCE_TIME, balance: 5})
    ).toEqual({
      time: {
        isFetching: false,
        isFetched: true,
        balance: 5
      }
    })
    expect(
      reducer({time: {balance: 3}}, {type: a.WALLET_BALANCE_TIME, balance: null})
    ).toEqual({
      time: {
        isFetching: false,
        isFetched: true,
        balance: 3
      }
    })
  })

  it('should handle WALLET_TIME_DEPOSIT', () => {
    expect(
      reducer([], {type: a.WALLET_TIME_DEPOSIT, deposit: 10})
    ).toEqual({
      time: {
        deposit: 10
      }
    })
  })

  it('should handle WALLET_BALANCE_LHT_FETCH', () => {
    expect(
      reducer([], {type: a.WALLET_BALANCE_LHT_FETCH})
    ).toEqual({
      lht: {
        isFetching: true
      }
    })
  })

  it('should handle WALLET_BALANCE_LHT', () => {
    expect(
      reducer([], {type: a.WALLET_BALANCE_LHT, balance: 5})
    ).toEqual({
      lht: {
        isFetching: false,
        isFetched: true,
        balance: 5
      }
    })
  })

  it('should handle WALLET_BALANCE_ETH_FETCH', () => {
    expect(
      reducer([], {type: a.WALLET_BALANCE_ETH_FETCH})
    ).toEqual({
      eth: {
        isFetching: true
      }
    })
  })

  it('should handle WALLET_BALANCE_ETH', () => {
    expect(
      reducer([], {type: a.WALLET_BALANCE_ETH, balance: 5})
    ).toEqual({
      eth: {
        isFetching: false,
        isFetched: true,
        balance: 5
      }
    })
  })

  it('should handle WALLET_TRANSACTIONS_FETCH', () => {
    expect(
      reducer([], {type: a.WALLET_TRANSACTIONS_FETCH})
    ).toEqual({
      isFetching: true
    })
  })

  it('should handle WALLET_TRANSACTION', () => {
    expect(
      reducer({transactions: new Map()}, {type: a.WALLET_TRANSACTION, tx})
    ).toEqual({
      transactions
    })
  })

  it('should handle WALLET_TRANSACTIONS', () => {
    expect(
      reducer({transactions}, {type: a.WALLET_TRANSACTIONS, map: transactions1, toBlock: 100})
    ).toEqual({
      isFetching: false,
      isFetched: true,
      transactions: transactions.set(tx1.id(), tx1),
      toBlock: 100
    })
  })

  it('should handle WALLET_CM_BALANCE_LHT_FETCH', () => {
    expect(
      reducer([], {type: a.WALLET_CM_BALANCE_LHT_FETCH})
    ).toEqual({
      contractsManagerLHT: {
        isFetching: true
      }
    })
  })

  it('should handle WALLET_CM_BALANCE_LHT', () => {
    expect(
      reducer([], {type: a.WALLET_CM_BALANCE_LHT, balance: 5})
    ).toEqual({
      contractsManagerLHT: {
        isFetching: false,
        balance: 5
      }
    })
  })

  it('should handle WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH', () => {
    expect(
      reducer([], {type: a.WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH})
    ).toEqual({
      contractsManagerLHT: {
        isSubmitting: true
      }
    })
  })

  it('should handle WALLET_SEND_CM_LHT_TO_EXCHANGE_END', () => {
    expect(
      reducer([], {type: a.WALLET_SEND_CM_LHT_TO_EXCHANGE_END})
    ).toEqual({
      contractsManagerLHT: {
        isSubmitting: false
      }
    })
  })
})
