/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { TxExecModel, WalletModel, MultisigEthWalletModel } from '../../models'
import { getWallet } from '../wallets/selectors/models'
import { getMainSymbolForBlockchain } from '../tokens/selectors'
import { DUCK_NEM } from './constants'

export const nemSelector = () => (state) =>
  state.get(DUCK_NEM)

export const web3Selector = () => createSelector(
  nemSelector(),
  (nem) => {
    return nem == null // nil check
      ? null
      : nem.web3.value
  },
)

export const nemPendingSelector = () => createSelector(
  nemSelector(),
  (nem) => nem == null // nil check
    ? null
    : nem.pending,
)

export const nemPendingFormatSelector = () => createSelector(
  nemSelector(),
  (nem) => {
    if (nem == null || nem.pending == null) {
      return null
    }

    return Object.values(nem.pending)
      .reduce((accumulator, txList) => {
        return accumulator.concat(Object.values(txList)
          .filter((tx) => tx.isAccepted && !tx.isMined))
      }, [])
  },
)

export const nemPendingCountSelector = () => createSelector(
  nemPendingFormatSelector(),
  (pendingList) => {
    return pendingList ? pendingList.length : 0
  },
)

export const pendingEntrySelector = (address, key) => createSelector(
  nemPendingSelector(),
  (pending) => {
    if (address in pending) {
      const res = pending[address][key] || null
      if (!res) {
        // eslint-disable-next-line
        console.log('res null', address, key, pending, new Error())
      }
      return res
    }

    // eslint-disable-next-line
    console.log('res null', address, key, pending, new Error())
    return null
  },
)

export const getDataForConfirm = (tx: TxExecModel) => createSelector(
  [
    getWallet(`${tx.blockchain}-${tx.from}`),
  ],
  (wallet: WalletModel | MultisigEthWalletModel) => {
    let amountBalanceAfter = null
    let feeBalanceAfter = null

    const mainSymbol = getMainSymbolForBlockchain(tx.blockchain)
    const balances = wallet.balances
    const amountBalance = balances[tx.symbol]
    const feeBalance = balances[mainSymbol]
    if (tx.fields && tx.fields.amount) {
      amountBalanceAfter = tx.fields.amount.mark === 'plus' ?
        amountBalance.plus(tx.fields.amount.value) :
        amountBalance.minus(tx.fields.amount.value)
    }

    const gasFee = tx.gasPrice.mul(tx.gasLimit)
    if (mainSymbol === tx.symbol) {
      feeBalanceAfter = amountBalanceAfter = amountBalanceAfter.minus(gasFee)
    } else {
      feeBalanceAfter = feeBalance.minus(gasFee)
    }

    return {
      fields: tx.fields,
      mainSymbol,
      amountBalanceAfter,
      feeBalanceAfter,
    }
  },
)
