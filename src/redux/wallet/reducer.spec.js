import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import * as a from './actions'
import reducer from './reducer'
import TokenModel from 'models/TokenModel'
import TxModel from 'models/TxModel'

const token1 = new TokenModel({symbol: 'TK1'})
const token2 = new TokenModel({symbol: 'TK2'})

const tx1 = new TxModel({txHash: 'hash1', from: 1, to: 2})
const tx2 = new TxModel({txHash: 'hash2', from: 3, to: 4})

describe('settings wallet reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      tokensFetching: true,
      tokens: new Immutable.Map(), /** @see TokenModel */
      transactions: {
        list: new Immutable.Map(),
        isFetching: false,
        endOfList: false
      },
      timeDeposit: new BigNumber(0),
      timeAddress: '',
      isTIMERequired: true
    })
  })

  it('should handle WALLET_TOKENS_FETCH', () => {
    expect(
      reducer({tokensFetching: false}, {type: a.WALLET_TOKENS_FETCH})
    ).toEqual({
      tokensFetching: true
    })
  })

  it('should handle WALLET_TOKENS_FETCH', () => {
    const tokens = new Immutable.Map({
      'TK1': token1,
      'TK2': token2
    })
    expect(
      reducer({}, {type: a.WALLET_TOKENS, tokens})
    ).toEqual({
      tokensFetching: false,
      tokens
    })
  })

  it.skip('should handle WALLET_BALANCE', () => {
    expect(
      reducer({tokens: new Immutable.Map({'TK1': token1})}, {type: a.WALLET_BALANCE, symbol: 'TK1', balance: 5})
    ).toEqual({
      tokens: new Immutable.Map({
        TK1: new TokenModel({
          symbol: 'TK1',
          balance: 5
        }).fetching().notFetching()
      })
    })
  })

  it.skip('should handle WALLET_TIME_DEPOSIT', () => {
    expect(
      reducer({timeDeposit: 5, isTimeDepositFetching: true}, {type: a.WALLET_TIME_DEPOSIT, deposit: 10})
    ).toEqual({
      isTimeDepositFetching: false,
      timeDeposit: 10
    })
  })

  it('should handle WALLET_TRANSACTIONS_FETCH', () => {
    const initial = {
      transactions: {
        list: new Immutable.Map({a: 1}),
        isFetching: false
      }
    }
    expect(
      reducer(initial, {type: a.WALLET_TRANSACTIONS_FETCH})
    ).toEqual({
      transactions: {
        list: new Immutable.Map({a: 1}),
        isFetching: true
      }
    })
  })

  it('should handle WALLET_TRANSACTION', () => {
    const initial = {
      transactions: {
        list: new Immutable.Map({
          [tx1.id()]: tx1
        })
      }
    }
    const updatedTx = new TxModel({txHash: 'hash1', from: 1, to: 2, blockNumber: 10})

    expect(
      reducer(initial, {type: a.WALLET_TRANSACTION, tx: updatedTx})
    ).toEqual({
      transactions: {
        list: new Immutable.Map({
          'hash1 - 1 - 2': updatedTx
        })
      }
    })
  })

  it('should handle WALLET_TRANSACTIONS', () => {
    const initial = {
      transactions: {
        list: new Immutable.Map({
          tx1
        }),
        endOfList: true,
        isFetching: true
      }
    }
    expect(
      reducer(initial, {type: a.WALLET_TRANSACTIONS, map: {tx2}})
    ).toEqual({
      transactions: {
        list: new Immutable.Map({tx1, tx2}),
        endOfList: false,
        isFetching: false
      }
    })
  })

  it('should handle WALLET_REQUIRE_TIME', () => {
    expect(
      reducer({isTIMERequired: true}, {type: a.WALLET_IS_TIME_REQUIRED, value: false})
    ).toEqual({
      isTIMERequired: false
    })
  })
})
