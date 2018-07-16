/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as a from './actions'
import WalletModel from '../../models/wallet/WalletModel'

const initialState = {
  list: {},
  twoFAConfirmed: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.WALLETS_SET:
      return {
        ...state,
        list: {
          ...state.list,
          [action.wallet.id]: action.wallet,
        },
      }
    case a.WALLETS_UPDATE_BALANCE:
      return {
        ...state,
        list: {
          ...state.list,
          [action.walletId]: new WalletModel({
            ...state.list[action.walletId],
            balances: {
              ...state.list[action.walletId].balances,
              [action.balance.symbol()]: action.balance,
            },
          }),
        },
      }
    case a.WALLETS_TWO_FA_CONFIRMED:
      return {
        ...state,
        twoFAConfirmed: action.twoFAConfirmed,
      }
    default:
      return state
  }
}
