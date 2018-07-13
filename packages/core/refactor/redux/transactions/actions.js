/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Tx from 'ethereumjs-tx'
import { modalsOpenConfirmDialog } from '@chronobank/core-dependencies/redux/modals/actions'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'

export const DUCK_TRANSACTIONS = 'transactions'
export const TRANSACTIONS_NEW = 'transactions/new'
export const TRANSACTIONS_REMOVE = 'transactions/remove'

export const sendNewTx = (tx) => async (dispatch) => {
  dispatch({ type: TRANSACTIONS_NEW, tx })
  dispatch(modalsOpenConfirmDialog({
    props: {
      tx,
      confirm: acceptConfirm,
      reject: rejectConfirm,
    },
  }))
}

export const acceptConfirm = (tx) => (dispatch) => {
  dispatch(signAndSend(tx))
}

export const rejectConfirm = () => (dispatch) => {
  dispatch({ type: TRANSACTIONS_REMOVE })
}

export const signAndSend = (tx) => async (dispatch) => {
  const signedTx = await dispatch(signTx(tx))
  const hash = await dispatch(sendTx(signedTx))
  // eslint-disable-next-line
  console.log('hash', hash)
}

export const signTx = (execTx) => async (dispatch, getState) => {
  const web3 = getState().get('web3')
  const nonce = await web3.eth.getTransactionCount(execTx.from)

  const txData = {
    data: execTx.data || '',
    nonce: web3.utils.toHex(nonce),
    gasLimit: web3.utils.toHex(execTx.gasLimit),
    gasPrice: web3.utils.toHex(execTx.gasPrice),
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
