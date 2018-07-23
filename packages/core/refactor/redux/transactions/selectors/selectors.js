/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import TxExecModel from '../../../models/TxExecModel'
import { getWallet } from '../../../../redux/wallets/selectors/models'
import { getMainSymbolForBlockchain } from '../../../../redux/tokens/selectors'
import WalletModel from '../../../../models/wallet/WalletModel'

export const getDataForConfirm = (tx: TxExecModel) => createSelector(
  [
    getWallet(`${tx.blockchain}-${tx.from}`),
  ],
  (wallet: WalletModel) => {
    let amountBalanceAfter = null
    let feeBalanceAfter = null

    const mainSymbol = getMainSymbolForBlockchain(tx.blockchain)
    const balances = wallet.balances
    const amountBalance = balances[tx.symbol]
    const feeBalance = balances[mainSymbol]
    if (tx.fields && tx.fields.amount) {
      amountBalanceAfter = tx.fields.amount && tx.fields.amount.mark === 'plus' ?
        amountBalance.plus(tx.fields.amount.value) :
        amountBalance.minus(tx.fields.amount.value)
    }

    if (mainSymbol === tx.symbol) {
      feeBalanceAfter = amountBalanceAfter = amountBalanceAfter.minus(tx.fee.gasFee)
    } else {
      feeBalanceAfter = feeBalance.minus(tx.fee.gasFee)
    }

    return {
      fields: tx.fields,
      mainSymbol,
      amountBalanceAfter,
      feeBalanceAfter,
    }
  },
)
