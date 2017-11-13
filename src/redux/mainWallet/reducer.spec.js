import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import { accounts } from 'specsInit'
import MainWallet from 'models/Wallet/MainWalletModel'
import TokenModel from 'models/TokenModel'
import TxModel from 'models/TxModel'
import * as a from './actions'
import reducer from './reducer'

const token1 = new TokenModel({ symbol: 'TK1' })
const token2 = new TokenModel({ symbol: 'TK2' })

const tokens = new Immutable.Map({ [token1.symbol()]: token1 })

const tx1 = new TxModel({ txHash: 'hash1', from: 1, to: 2 })
const tx2 = new TxModel({ txHash: 'hash2', from: 3, to: 4 })

describe('settings wallet reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(new MainWallet())
  })

  it('should handle WALLET_TOKENS_FETCH', () => {
    expect(reducer({ tokensFetching: false }, { type: a.WALLET_TOKENS_FETCH })).toEqual({
      tokensFetching: true,
    })
  })

  it('should handle WALLET_TOKENS', () => {
    const tokens = new Immutable.Map({
      [token1.symbol()]: token1,
      [token2.symbol()]: token2,
    })
    expect(reducer({}, { type: a.WALLET_TOKENS, tokens })).toEqual({
      tokensFetching: false,
      tokensFetched: true,
      tokens,
    })
  })

  it('should handle WALLET_BALANCE', () => {
    expect(reducer({
      tokens,
    }, {
      type: a.WALLET_BALANCE, token: token1, isCredited: true, amount: 5,
    })).toEqual({
      tokens: new Immutable.Map({
        [token1.symbol()]: token1.updateBalance(true, 5),
      }),
    })
  })

  it('should handle WALLET_ALLOWANCE', () => {
    expect(reducer({
      tokens,
    }, {
      type: a.WALLET_ALLOWANCE, token: token1, spender: accounts[4], value: 4,
    })).toEqual({
      tokens: new Immutable.Map({
        [token1.symbol()]: token1.setAllowance(accounts[4], 4),
      }),
    })
  })

  it('should handle WALLET_TIME_DEPOSIT', () => {
    expect(reducer({
      timeDeposit: new BigNumber(5),
    }, {
      type: a.WALLET_TIME_DEPOSIT, isCredited: false, amount: 3,
    })).toEqual({
      timeDeposit: new BigNumber(2),
    })
  })

  it('should handle WALLET_TIME_DEPOSIT', () => {
    expect(reducer([], { type: a.WALLET_TIME_ADDRESS, address: accounts[5] })).toEqual({
      timeAddress: accounts[5],
    })
  })

  it('should handle WALLET_TRANSACTIONS_FETCH', () => {
    const initial = {
      transactions: {
        list: new Immutable.Map({ a: 1 }),
        isFetching: false,
      },
    }
    expect(reducer(initial, { type: a.WALLET_TRANSACTIONS_FETCH })).toEqual({
      transactions: {
        list: new Immutable.Map({ a: 1 }),
        isFetching: true,
      },
    })
  })

  it('should handle WALLET_TRANSACTION', () => {
    const initial = {
      transactions: {
        list: new Immutable.Map({
          [tx1.id()]: tx1,
        }),
      },
    }
    const updatedTx = new TxModel({
      txHash: 'hash1', from: 1, to: 2, blockNumber: 10,
    })

    expect(reducer(initial, { type: a.WALLET_TRANSACTION, tx: updatedTx })).toEqual({
      transactions: {
        list: new Immutable.Map({
          'hash1 - 1 - 2': updatedTx,
        }),
      },
    })
  })

  it('should handle WALLET_TRANSACTIONS', () => {
    const initial = {
      transactions: {
        list: new Immutable.Map({
          tx1,
        }),
        endOfList: true,
        isFetching: true,
      },
    }
    expect(reducer(initial, { type: a.WALLET_TRANSACTIONS, map: { tx2 } })).toEqual({
      transactions: {
        list: new Immutable.Map({ tx1, tx2 }),
        endOfList: false,
        isFetching: false,
      },
    })
  })

  it('should handle WALLET_IS_TIME_REQUIRED', () => {
    expect(reducer({ isTIMERequired: true }, { type: a.WALLET_IS_TIME_REQUIRED, value: false })).toEqual({
      isTIMERequired: false,
    })
  })
})
