/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { isNil, omitBy } from 'lodash'

import { describePendingTx } from '../../describers'
import { TxEntryModel } from '../../models'
import { modalsOpen } from '../modals/actions'
import { showSignerModal, closeSignerModal } from '../modals/thunks'
import { getAccount } from '../session/selectors/models'
import { nonceUpdate, txCreate, txUpdate } from './actions'
import { DUCK_PERSIST_ACCOUNT } from './constants'
import { createTxEntryModel, createTxExecModel, estimateTxGas } from './utils'

export const acceptEthereumLikeBlockchainTransaction = (
  entry,
  getSigner,
  getDerivedWallet,
  getWeb3,
  pendingEntrySelector,
  txStatus,
  processTransaction
) => (
  async (dispatch, getState) => {
    dispatch(txStatus(entry.key, entry.tx.from, { isAccepted: true, isPending: true }))

    const state = getState()
    let signer = getSigner(state)

    if (entry.walletDerivedPath) {
      signer = await getDerivedWallet(signer.privateKey, entry.walletDerivedPath)
    }

    return dispatch(processTransaction({
      web3: getWeb3(state),
      entry: pendingEntrySelector(entry.tx.from, entry.key)(state),
      signer,
    }))
  }
)

export const estimateEthereumLikeBlockchainGas = (tx, feeMultiplier, getWeb3, duckId) => async (dispatch, getState) => {
  const web3 = getWeb3(getState())
  const nonce = await dispatch(nextEthereumLikeBlockchainNonce({ web3, address: tx.from }, duckId))
  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).mul(feeMultiplier)
  const chainId = await web3.eth.net.getId()
  const gasLimit = await estimateTxGas(web3, tx, gasPrice, nonce, chainId)
  const gasFee = gasPrice.mul(gasLimit)

  return {
    gasLimit,
    gasFee,
    gasPrice,
  }
}

export const ethereumLikeBlockchainTxStatus = (pendingSelector, key, address, props) => (dispatch, getState) => {
  const pending = pendingSelector()(getState())
  const scope = pending[address]

  if (!scope) {
    return null
  }

  const entry = scope[key]

  if (!entry) {
    return null
  }

  return dispatch(txUpdate(
    key,
    address,
    new TxEntryModel({
      ...entry,
      ...props,
    }),
  ))
}

export const executeEthereumLikeBlockchainTransaction = ({ tx, options }, getWeb3, duckId, submitTransaction) => (
  async (dispatch, getState) => {
    const web3 = getWeb3(getState())
    const prepared = await dispatch(prepareEthereumLikeBlockchainTransaction({ web3, tx, options }, duckId))
    const entry = createTxEntryModel(prepared, options)

    await dispatch(txCreate(entry))
    dispatch(submitTransaction(entry))
  }
)

export const processEthereumLikeBlockchainTransaction = ({ web3, entry, signer }, txStatus, pendingEntrySelector) => (
  async (dispatch, getState) => {
    await dispatch(signEthereumLikeBlockchainTransaction({ entry, signer }, txStatus))
    return dispatch(sendSignedEthereumLikeBlockchainTransaction({
      web3,
      entry: pendingEntrySelector(entry.tx.from, entry.key)(getState()),
    }, txStatus, pendingEntrySelector))
  }
)

export const submitEthereumLikeBlockchainTransaction = (entry, getDAO, acceptTransaction, txStatus) => (
  async (dispatch, getState) => {
    const state = getState()
    const account = getAccount(state)
    const dao = getDAO(entry, state)

    const description = describePendingTx(entry, dao.getSymbol(), {
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
        reject: () => dispatch(txStatus(entry.key, entry.tx.from, { isRejected: true })),
      },
    }))
  }
)

const nextEthereumLikeBlockchainNonce = ({ web3, address }, duckId) => async (dispatch, getState) => {
  const addr = address.toLowerCase()
  const state = getState().get(duckId)

  return Math.max(
    (addr in state.nonces) ? state.nonces[addr] : 0,
    await web3.eth.getTransactionCount(addr, 'pending'),
  )
}

const prepareEthereumLikeBlockchainTransaction = ({ web3, tx, options }, duckId) => async (dispatch) => {
  const { feeMultiplier } = options || {}
  const nonce = await dispatch(nextEthereumLikeBlockchainNonce({ web3, address: tx.from }, duckId))
  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).mul(feeMultiplier || 1)
  const chainId = await web3.eth.net.getId()
  const gasLimit = await estimateTxGas(web3, tx, gasPrice, nonce, chainId)
  return createTxExecModel(tx, gasLimit, gasPrice, nonce, chainId)
}

const sendSignedEthereumLikeBlockchainTransaction = ({ web3, entry }, txStatus, pendingEntrySelector) => (
  async (dispatch, getState) => {
    dispatch(txStatus(entry.key, entry.tx.from, { isPending: true }))
    entry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
    dispatch(nonceUpdate(entry.tx.from, entry.tx.nonce))

    return new Promise((resolve, reject) => {
      web3.eth.sendSignedTransaction(entry.raw)
        .on('transactionHash', (hash) => {
          dispatch(txStatus(entry.key, entry.tx.from, { isSent: true, hash }))
        })
        .on('receipt', (receipt) => {
          dispatch(txStatus(entry.key, entry.tx.from, { isMined: true, receipt }))
          resolve(receipt)
        })
        .on('error', (error) => {
          dispatch(txStatus(entry.key, entry.tx.from, { isErrored: true, error }))
          reject(error)
        })
    })
  }
)

const signEthereumLikeBlockchainTransaction = ({ entry, signer }, txStatus) => async (dispatch, getState) => {
  try {
    const { selectedWallet } = getState().get(DUCK_PERSIST_ACCOUNT)

    dispatch(showSignerModal())
    const signed = await signer.signTransaction(omitBy(entry.tx, isNil), selectedWallet.encrypted[0].path)
    dispatch(closeSignerModal())

    const raw = signed.rawTransaction
    dispatch(txStatus(entry.key, entry.tx.from, { isSigned: true, raw }))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('signTransaction error: ', error)
    dispatch(closeSignerModal())
    dispatch(txStatus(entry.key, entry.tx.from, { isErrored: true, error }))
    throw error
  }
}
