/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Tx from 'ethereumjs-tx'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { modalsOpenConfirmDialog } from '@chronobank/core-dependencies/redux/modals/actions'
import { WATCHER_TX_SET } from '../watcher/constants'
import CurrentTransactionNotificationModel from '../../models/CurrentTransactionNotificationModel'
import {
  TRANSACTIONS_NEW,
  TRANSACTIONS_REMOVE,
} from './constants'

export const sendNewTx = (tx, acceptCallback) => async (dispatch) => {
  dispatch({ type: TRANSACTIONS_NEW, tx })
  dispatch(modalsOpenConfirmDialog({
    props: {
      tx,
      acceptCallback,
      confirm: acceptConfirm(acceptCallback),
      reject: rejectConfirm,
    },
  }))
}

export const acceptConfirm = (acceptCallback) => (tx) => (dispatch) => {
  dispatch(signAndSend(tx, acceptCallback))
}

export const rejectConfirm = (tx) => (dispatch) => {
  dispatch({ type: TRANSACTIONS_REMOVE })
}

export const signAndSend = (tx, acceptCallback) => async (dispatch) => {
  const signedTx = await dispatch(signTx(tx))
  dispatch({
    type: WATCHER_TX_SET, tx: new CurrentTransactionNotificationModel({
      id: tx.id,
      title: tx.title(),
      date: tx.time,
      details: tx.details(),
    }),
  })
  const hash = await dispatch(sendTx(signedTx))
  // eslint-disable-next-line no-console
  console.log('signAndSend transaction: ', hash, signedTx)

  if (typeof acceptCallback === 'function') {
    acceptCallback(hash, tx)
  }
}

export const signTx = (execTx) => async (dispatch, getState) => {
  const web3 = getState().get('web3')
  const nonce = await web3.eth.getTransactionCount(execTx.from)

  const txData = {
    data: execTx.data || '',
    nonce: web3.utils.toHex(nonce),
    gasLimit: web3.utils.toHex(execTx.fee.gasLimit.toString()),
    gasPrice: web3.utils.toHex(execTx.fee.gasPrice.toString()),
    to: execTx.to,
    from: execTx.from,
    value: web3.utils.toHex(execTx.value.toString()),
  }

  const pk = ethereumProvider.getPrivateKey(execTx.from)
  const transaction = new Tx(txData)
  transaction.sign(pk)
  return transaction
}

export const sendTx = (transaction) => (dispatch, getState) => {
  const web3 = getState().get('web3')
  const serializedTx = transaction.serialize().toString('hex')
  return web3.eth.sendSignedTransaction('0x' + serializedTx)
}
