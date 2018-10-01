/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import { accounts } from 'specsInit'
import MainWallet from '../../models/wallet/MainWalletModel'
import TransactionsCollection from '../../models/wallet/TransactionsCollection'
import TokenModel from '../../models/tokens/TokenModel'
import TxModel from '../../models/TxModel'
import * as a from './actions'
import reducer from './reducer'

const token1 = new TokenModel({ symbol: 'TK1' })

const tokens = new Immutable.Map({ [token1.symbol()]: token1 })

const tx1 = new TxModel({ txHash: 'hash1', from: 1, to: 2 })
const tx2 = new TxModel({ txHash: 'hash2', from: 3, to: 4 })

describe('settings wallet reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(new MainWallet())
  })

  // it('should handle WALLET_TOKENS', () => {
  //   const tokens = new Immutable.Map({
  //     [token1.symbol()]: token1,
  //     [token2.symbol()]: token2,
  //   })
  //   expect(reducer(new MainWallet({}), { type: a.WALLET_TOKENS, tokens })).toMatchSnapshot()
  // })

  it('should handle WALLET_BALANCE', () => {
    expect(reducer(new MainWallet({
      tokens,
    }), {
      type: a.WALLET_BALANCE, token: token1, isCredited: true, amount: 5,
    })).toMatchSnapshot()
  })

  it('should handle WALLET_ALLOWANCE', () => {
    expect(reducer(new MainWallet({
      tokens,
    }), {
      type: a.WALLET_ALLOWANCE, token: token1, spender: accounts[4], value: 4,
    })).toMatchSnapshot()
  })

  // it('should handle WALLET_TIME_DEPOSIT with non empty wallet', () => {
  //   expect(reducer(new MainWallet({
  //     timeDeposit: new BigNumber(5),
  //   }), {
  //     type: a.WALLET_TIME_DEPOSIT, isCredited: false, amount: 3,
  //   })).toMatchSnapshot()
  // })

  // it('should handle WALLET_TIME_DEPOSIT with empty wallet', () => {
  //   expect(reducer(new MainWallet(), { type: a.WALLET_TIME_ADDRESS, address: accounts[5] })).toMatchSnapshot()
  // })

  it('should handle WALLET_TRANSACTIONS_FETCH', () => {
    const initial = new MainWallet({
      transactions: new TransactionsCollection({
        list: new Immutable.Map({ a: 1 }),
        isFetching: false,
      }),
    })
    expect(reducer(initial, { type: a.WALLET_TRANSACTIONS_FETCH })).toMatchSnapshot()
  })

  it('should handle WALLET_TRANSACTION', () => {
    const initial = new MainWallet({
      transactions: new TransactionsCollection({
        list: new Immutable.Map({
          [tx1.id()]: tx1,
        }),
      }),
    })
    const updatedTx = new TxModel({
      txHash: 'hash1', from: 1, to: 2, blockNumber: 10,
    })

    expect(reducer(initial, { type: a.WALLET_TRANSACTION, tx: updatedTx })).toMatchSnapshot()
  })

  it('should handle WALLET_TRANSACTIONS', () => {
    const initial = new MainWallet({
      transactions: new TransactionsCollection({
        list: new Immutable.Map({
          tx1,
        }),
        endOfList: true,
        isFetching: true,
      }),
    })
    expect(reducer(initial, { type: a.WALLET_TRANSACTIONS, map: { tx2 } })).toMatchSnapshot()
  })

  it('should handle WALLET_IS_TIME_REQUIRED', () => {
    expect(reducer(new MainWallet({ isTIMERequired: true }), { type: a.WALLET_IS_TIME_REQUIRED, value: false })).toMatchSnapshot()
  })
})
