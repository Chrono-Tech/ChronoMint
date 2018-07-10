/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'

export const DUCK_TRANSACTIONS = 'transactions'
export const TRANSACTIONS_NEW = 'transactions/new'
export const TRANSACTIONS_REMOVE = 'transactions/remove'

export const sendNewtx = (tx) => (dispatch) => {
  dispatch({ type: TRANSACTIONS_NEW, tx })
  dispatch(acceptConfirm(tx))
}

export const acceptConfirm = (tx) => (dispatch) => {
  dispatch(signAndSend(tx))
}

export const rejectConfirm = () => (dispatch) => {
  dispatch({ type: TRANSACTIONS_REMOVE })
}

export const signAndSend = () => async (dispatch) => {
  const signedTx = await  dispatch(signTx)
  const hash = await dispatch(signedTx)
}

export const signTx = () => (dispatch) => {
  // eslint-disable-next-line
  console.log('ethereumProvider', ethereumProvider.getEngine())
}

export const sendTx = () => (dispatch) => {

}
