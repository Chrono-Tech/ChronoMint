/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getTransactionsForMainWallet } from '../mainWallet/actions'
import { getTransactionsForEthMultisigWallet } from '../multisigWallet/actions'
import { WALLET_SELECT_WALLET } from './constants'

export const selectWallet = (blockchain: string, address: string) => (dispatch) => {
  dispatch({ type: WALLET_SELECT_WALLET, blockchain, address })
}

/**
 * Format data for transaction widget
 *
 * @param wallet - WalletModel
 * @param address - string
 * @param blockchain - string
 * @returns {function(*, *): *}
 */
export const formatDataAndGetTransactionsForWallet = ({ wallet, address, blockchain }) => async (dispatch) => {
  switch (true) {
    case wallet && wallet.isMain:
      return dispatch(getTransactionsForMainWallet({ wallet, address, blockchain }))
    case wallet && wallet.isMultisig:
      return dispatch(getTransactionsForEthMultisigWallet({ wallet, address, blockchain }))
  }
}
