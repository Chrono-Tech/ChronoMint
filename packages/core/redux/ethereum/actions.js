/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import { isNil, omitBy } from 'lodash'
import { modalsOpenConfirmDialog } from '@chronobank/core-dependencies/redux/modals/actions'
import { SignerMemoryModel, TxEntryModel, TxExecModel } from '../../models'
import { pendingEntrySelector, web3Selector } from './selectors'
import { DUCK_ETHEREUM, NONCE_UPDATE, TX_CREATE, TX_STATUS, WEB3_UPDATE } from './constants'
import { getSigner } from '../persistAccount/selectors'

export const initEthereum = ({ web3 }) => (dispatch) => {
  dispatch({ type: WEB3_UPDATE, web3 })
}

export const nextNonce = ({ web3, address }) => async (dispatch, getState) => {
  // eslint-disable-next-line no-param-reassign
  address = address.toLowerCase()
  const state = getState().get(DUCK_ETHEREUM)
  const nonce = Math.max(
    (address in state.nonces)
      ? state.nonces[address] + 1
      : 0,
    await web3.eth.getTransactionCount(address, 'pending'),
  )
  dispatch({ type: NONCE_UPDATE, address, nonce })
  return nonce
}

export const executeTransaction = ({ web3, tx, options }) => async (dispatch, getState) => {
  if (!web3) {
    web3 = web3Selector()(getState())
  }
  const prepared = await dispatch(prepareTransaction({ web3, tx, options }))
  const entry = new TxEntryModel({
    key: uuid(),
    tx: prepared,
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options.walletDerivedPath,
  })

  await dispatch({ type: TX_CREATE, entry })

  dispatch(submitTransaction(entry))
}

export const prepareTransaction = ({ web3, tx, options }) => async (dispatch) => {
  const { feeMultiplier } = options || {}
  const nonce = await dispatch(nextNonce({ web3, address: tx.from }))
  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).mul(feeMultiplier || 1)
  const chainId = await web3.eth.net.getId()

  const gasLimit = await web3.eth.estimateGas({
    from: tx.from,
    to: tx.to,
    gasPrice,
    value: tx.value,
    data: tx.data,
    nonce,
    chainId,
  })

  return new TxExecModel({
    ...tx,
    hash: null,
    data: tx.data != null
      ? tx.data
      : null,
    block: null,
    from: tx.from.toLowerCase(),
    to: tx.to.toLowerCase(),
    gasLimit: new BigNumber(gasLimit),
    gasPrice,
    nonce,
    chainId,
  })
}

export const processTransaction = ({ web3, entry, signer }) => async (dispatch, getState) => {
  await dispatch(signTransaction({ entry, signer }))
  return dispatch(sendSignedTransaction({
    web3,
    entry: pendingEntrySelector(entry.tx.from, entry.key)(getState()),
  }))
}

export const signTransaction = ({ entry, signer }) => async (dispatch) => {
  try {
    const signed = await signer.signTransaction(omitBy(entry.tx, isNil))
    const raw = signed.rawTransaction
    dispatch({
      type: TX_STATUS,
      key: entry.key,
      address: entry.tx.from,
      props: {
        isSigned: true,
        raw,
      },
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('signTransaction error: ', e)
    dispatch({
      type: TX_STATUS,
      key: entry.key,
      address: entry.tx.from,
      props: {
        isErrored: true,
        error: e,
      },
    })
    throw e
  }
}

export const sendSignedTransaction = ({ web3, entry }) => async (dispatch, getState) => {
  dispatch({
    type: TX_STATUS,
    key: entry.key,
    address: entry.tx.from,
    props: {
      isPending: true,
    },
  })

  // eslint-disable-next-line
  entry = pendingEntrySelector(entry.tx.from, entry.key)(getState())

  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(entry.raw)
      .on('transactionHash', (transactionHash) => {
        dispatch({
          type: TX_STATUS,
          key: entry.key,
          address: entry.tx.from,
          props: {
            isSent: true,
            hash: transactionHash,
          },
        })
      })
      .on('receipt', (receipt) => {
        dispatch({
          type: TX_STATUS,
          key: entry.key,
          address: entry.tx.from,
          props: {
            isMined: true,
            receipt,
          },
        })
        resolve(receipt)
      })
      .on('error', (error) => {
        dispatch({
          type: TX_STATUS,
          key: entry.key,
          address: entry.tx.from,
          props: {
            isErrored: true,
            error: error,
          },
        })
        reject(error)
      })
  })
}

const submitTransaction = (entry) => async (dispatch) => {
  dispatch(modalsOpenConfirmDialog({
    props: {
      entry,
      accept: acceptTransaction,
      reject: rejectTransaction,
    },
  }))
}

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch({
    type: TX_STATUS,
    key: entry.key,
    address: entry.tx.from,
    props: {
      isAccepted: true,
      isPending: true,
    },
  })
  const state = getState()
  let signer = getSigner(state)
  if (entry.walletDerivedPath) {
    signer = await SignerMemoryModel.fromDerivedPath({ seed: signer.privateKey, derivedPath: entry.walletDerivedPath })
  }

  return dispatch(processTransaction({
    web3: web3Selector()(state),
    entry: pendingEntrySelector(entry.tx.from, entry.key)(state),
    signer,
  }))
}

const rejectTransaction = (entry) => (dispatch) => {
  dispatch({
    type: TX_STATUS,
    key: entry.key,
    address: entry.tx.from,
    props: {
      isRejected: true,
    },
  })
}

export const estimateGas = (tx, feeMultiplier) => async (dispatch, getState) => {

  const web3 = web3Selector()(getState())
  const nonce = await dispatch(nextNonce({ web3, address: tx.from }))
  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).mul(feeMultiplier || 1)
  const chainId = await web3.eth.net.getId()
  const gasLimit = await web3.eth.estimateGas({
    from: tx.from,
    to: tx.to,
    gasPrice,
    value: tx.value,
    data: tx.data,
    nonce,
    chainId,
  })

  return { gasLimit, gasFee: gasPrice.mul(gasLimit), gasPrice }

}
