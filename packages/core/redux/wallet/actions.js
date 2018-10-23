/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getTransactionsForMainWallet, updateWalletBalance } from '../wallets/actions'
import { getTransactionsForEthMultisigWallet, updateEthMultisigWalletBalance } from '../multisigWallet/actions'
import { WALLET_SELECT_WALLET } from './constants'
import { BLOCKCHAIN_ETHEREUM, BLOCKCHAIN_LABOR_HOUR } from '../../dao/constants'
import ethereumDAO from '../../dao/EthereumDAO'
import lhtDAO from '../../dao/LaborHourTokenDAO'

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
      return dispatch(getTransactionsForMainWallet({ address, blockchain }))
    case wallet && wallet.isMultisig:
      return dispatch(getTransactionsForEthMultisigWallet({ wallet, address, blockchain }))
  }
}

export const subscribeWallet = ({ wallet }) => async (dispatch) => {
  const listener = function (data) {
    const checkedFrom = data.from ? data.from.toLowerCase() === wallet.address.toLowerCase() : false
    const checkedTo = data.to ? data.to.toLowerCase() === wallet.address.toLowerCase() : false
    if (checkedFrom || checkedTo) {
      if (wallet.isMain || wallet.isDerived) {
        dispatch(updateWalletBalance({ wallet }))
      }
      if (wallet.isMultisig) {
        dispatch(updateEthMultisigWalletBalance({ wallet }))
      }
    }
  }
  switch (wallet.blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      ethereumDAO.on('tx', listener)
      return listener
    case BLOCKCHAIN_LABOR_HOUR:
      lhtDAO.on('tx', listener)
      return listener
    default:
      return
  }
}

export const unsubscribeWallet = ({ wallet, listener }) => async () => {
  switch (wallet.blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      ethereumDAO.removeListener('tx', listener)
      return listener
    case BLOCKCHAIN_LABOR_HOUR:
      lhtDAO.removeListener('tx', listener)
      return listener
    default:
      return
  }
}
