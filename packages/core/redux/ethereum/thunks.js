/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { isNil, omitBy } from 'lodash'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import { SignerMemoryModel, TxEntryModel, HolderModel } from '../../models'
import { ethereumPendingSelector, pendingEntrySelector, web3Selector } from './selectors'
import { DUCK_ETHEREUM } from './constants'
import { getSigner } from '../persistAccount/selectors'
import ethereumDAO from '../../dao/EthereumDAO'
import { describePendingTx } from '../../describers'
import { daoByAddress } from '../daos/selectors'
import { getAccount } from '../session/selectors/models'
import * as ethActions from './actions'
import * as Utils from './utils'

export const initEthereum = ({ web3 }) => (dispatch) => {
  dispatch(ethActions.ethWeb3Update(new HolderModel({ value: web3 })))
}

const ethTxStatus = (key, address, props) => (dispatch, getState) => {
  const pending = ethereumPendingSelector()(getState())
  const scope = pending[address]
  if (!scope) {
    return null
  }
  const entry = scope[key]
  if (!entry) {
    return null
  }
  return dispatch(ethActions.ethTxUpdate(
    key,
    address,
    new TxEntryModel({
      ...entry,
      ...props,
    }),
  ))
}

export const nextNonce = ({ web3, address }) => async (dispatch, getState) => {
  // eslint-disable-next-line no-param-reassign
  address = address.toLowerCase()
  const state = getState().get(DUCK_ETHEREUM)
  return Math.max(
    (address in state.nonces)
      ? state.nonces[address]
      : 0,
    await web3.eth.getTransactionCount(address, 'pending'),
  )
}

export const executeTransaction = ({ tx, options }) => async (dispatch, getState) => {
  const web3 = web3Selector()(getState())
  const prepared = await dispatch(prepareTransaction({ web3, tx, options }))
  const entry = Utils.createEthTxEntryModel(prepared, options)

  await dispatch(ethActions.ethTxCreate(entry))
  dispatch(submitTransaction(entry))
}

export const prepareTransaction = ({ web3, tx, options }) => async (dispatch) => {
  const { feeMultiplier } = options || {}
  const nonce = await dispatch(nextNonce({ web3, address: tx.from }))
  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).mul(feeMultiplier || 1)
  const chainId = await web3.eth.net.getId()
  const gasLimit = await Utils.estimateEthTxGas(web3, tx, gasPrice, nonce, chainId)
  return Utils.createEthTxExecModel(tx, gasLimit, gasPrice, nonce, chainId)
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
    dispatch(ethTxStatus(entry.key, entry.tx.from, { isSigned: true, raw }))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('signTransaction error: ', error)
    dispatch(ethTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
    throw error
  }
}

export const sendSignedTransaction = ({ web3, entry }) => async (dispatch, getState) => {
  dispatch(ethTxStatus(entry.key, entry.tx.from, { isPending: true }))

  // eslint-disable-next-line
  entry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  dispatch(ethActions.ethNonceUpdate(entry.tx.from, entry.tx.nonce))

  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(entry.raw)
      .on('transactionHash', (hash) => {
        dispatch(ethTxStatus(entry.key, entry.tx.from, { isSent: true, hash }))
      })
      .on('receipt', (receipt) => {
        dispatch(ethTxStatus(entry.key, entry.tx.from, { isMined: true, receipt }))
        resolve(receipt)
      })
      .on('error', (error) => {
        dispatch(ethTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
        reject(error)
      })
  })
}

const submitTransaction = (entry) => async (dispatch, getState) => {

  const state = getState()
  const account = getAccount(state)
  const dao = daoByAddress(entry.tx.to)(state) || ethereumDAO

  const description = describePendingTx(entry, {
    address: account,
    abi: dao.abi,
    token: dao.token,
  })

  dispatch(modalsOpen({
    componentName: 'ConfirmTxDialog',
    props: {
      entry,
      description,
      accept: acceptTransaction,
      reject: () => dispatch(ethTxStatus(entry.key, entry.tx.from, { isRejected: true })),
    },
  }))
}

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch(ethTxStatus(entry.key, entry.tx.from, { isAccepted: true, isPending: true }))

  const state = getState()
  let signer = getSigner(state)
  if (entry.walletDerivedPath) {
    signer = await SignerMemoryModel.fromDerivedPath({
      seed: signer.privateKey,
      derivedPath: entry.walletDerivedPath,
    })
  }

  return dispatch(processTransaction({
    web3: web3Selector()(state),
    entry: pendingEntrySelector(entry.tx.from, entry.key)(state),
    signer,
  }))
}

export const estimateGas = (tx, feeMultiplier = 1) => async (dispatch, getState) => {

  const web3 = web3Selector()(getState())
  const nonce = await dispatch(nextNonce({ web3, address: tx.from }))
  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).mul(feeMultiplier)
  const chainId = await web3.eth.net.getId()
  const gasLimit = await Utils.estimateEthTxGas(web3, tx, gasPrice, nonce, chainId)
  const gasFee = gasPrice.mul(gasLimit)

  return {
    gasLimit,
    gasFee,
    gasPrice,
  }
}
