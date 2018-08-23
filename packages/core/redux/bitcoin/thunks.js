/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import { TxEntryModel } from '../../models'
import { getBtcFee, getProviderByBlockchain } from '../tokens/utils'
import TransferExecModel from '../../models/TransferExecModel'
import Amount from '../../models/Amount'
import { notifyError } from '../notifier/actions'
import TransferError from '../../models/TransferError'
import { TRANSFER_CANCELLED } from '../../models/constants/TransferError'
import * as BitcoinActions from './actions'

export const executeTransaction = ({ tx, options = null }) => async (dispatch, getState) => {

  console.log('before updateTx')

  const updatedTx = await dispatch(prepareTransaction(tx, options))

  const entry = new TxEntryModel({
    key: uuid(),
    tx: updatedTx,
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
  })

  dispatch(BitcoinActions.createTransaction(entry))

  console.log('updateTx', updatedTx)

  dispatch(submitTransaction(entry))
}

export const prepareTransaction = (tx, {
  feeMultiplier = 1,
  satPerByte = null,
  wallet,
  token,
}) => async () => {
  const tokenRate = satPerByte ? satPerByte : feeMultiplier * tx.token.feeRate()

  const fee = await getBtcFee({
    address: tx.from,
    recipient: tx.to,
    amount: tx.value,
    formFee: tokenRate,
    blockchain: wallet.blockchain
  })

  return new TransferExecModel({
    title: `tx.Bitcoin.${wallet.blockchain}.transfer.title`,
    blockchain: wallet.blockchain,
    from: tx.from,
    to: tx.to,
    amount: new Amount(tx.value, token.symbol()),
    amountToken: token,
    fee: new Amount(fee, token.symbol()),
    feeToken: token,
    feeMultiplier,
    options: {
      advancedParams: {
        satPerByte,
      }

    }
  })
}

const submitTransaction = (entry) => async (dispatch) => {
  dispatch(modalsOpen({
    componentName: 'ConfirmTransferDialog',
    props: {
      tx: entry.tx,
      confirm: () => dispatch(acceptTransaction(entry)),
      reject: () => dispatch(rejectTransaction(entry)),
    },
  }))
}

const acceptTransaction = (entry) => async (dispatch,) => {
  const { tx } = entry

  dispatch(BitcoinActions.acceptTransaction(entry))

  const provider = getProviderByBlockchain(tx.blockchain())

  if (provider) {
    provider.transfer(tx.from(), tx.to(), tx.amount(), tx.fee())
  }
}

const rejectTransaction = (entry) => (dispatch) => {
  dispatch(BitcoinActions.rejectTransaction(entry))

  const e = new TransferError('Rejected', TRANSFER_CANCELLED)
  dispatch(notifyError(e, entry.tx.funcTitle()))
}
