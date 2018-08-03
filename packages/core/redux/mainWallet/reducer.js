/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { REHYDRATE } from 'redux-persist'
import MainWalletModel from '../../models/wallet/MainWalletModel'
import TransactionsCollection from '../../models/wallet/TransactionsCollection'
import * as a from './constants'

const initialState = new MainWalletModel()

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = action.payload.mainWallet
      if (incoming && incoming instanceof MainWalletModel) return state.names(incoming.names())
      return state
    }
    case a.WALLET_INIT:
      return state.isInited(action.isInited)
    case a.WALLET_BALANCE: // TODO @ipavlenko: Odd code, remove WALLET_BALANCE
      return state.balances(state.balances().update(
        state.balances().item(action.token.id()).updateBalance(action.isCredited, action.amount),
      ))
    case a.WALLET_ALLOWANCE:
      return state.allowances(state.allowances().update(action.allowance))
    case a.WALLET_ADDRESS:
      return state.addresses(state.addresses().update(action.address))
    case a.WALLET_TRANSACTIONS_FETCH:
      return state.updateTransactionsGroup({
        blockchain: action.blockchain,
        address: action.address,
        group: (state.transactions({
          blockchain: action.blockchain,
          address: action.address,
        }) || new TransactionsCollection()).isFetching(true),
      })
    case a.WALLET_TRANSACTION:
      return state.setTransaction(action.tx)
    case a.WALLET_TRANSACTION_UPDATED:
      return state.setTransaction(action.tx)
    case a.WALLET_TRANSACTIONS:
      return state.updateTransactionsGroup({
        blockchain: action.blockchain,
        address: action.address,
        group: action.group,
      })
    case a.WALLET_IS_TIME_REQUIRED:
      return state.isTIMERequired(action.value)
    case a.WALLET_TOKEN_BALANCE:
      return state.balances(state.balances().update(
        action.balance,
      ))
    case a.WALLET_SET_NAME:
      return state.names(state.names().set(`${action.blockchain}-${action.address}`, action.name))

    default:
      return state
  }
}
