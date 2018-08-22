/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { isNil, omitBy } from 'lodash'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import { SignerMemoryModel } from '../../models'
import { pendingEntrySelector, web3Selector } from './selectors'
import { getSelectedNetworkId, getSigner } from '../persistAccount/selectors'
import ethereumDAO from '../../dao/EthereumDAO'
import { describePendingTx } from '../../describers'
import { daoByAddress } from '../daos/selectors'
import { getAccount } from '../session/selectors/models'
import * as Actions from './actions'
import * as Utils from './utils'

export const executeNemTransaction = ({ tx, options }) => async (dispatch) => {
  const prepared = await dispatch(prepareTransaction({ tx, options }))
  const entry = Utils.createNemTxEntryModel(prepared, options)

  await dispatch(Actions.nemTxCreate(entry))
  dispatch(submitTransaction(entry))
}

export const prepareTransaction = ({ tx }) => async (dispatch, getState) => {
  const networkId = getSelectedNetworkId(getState())
  return tx.mosaicDefinition
    ? Utils.describeMosaicTransaction(tx, networkId)
    : Utils.describeXemTransaction(tx, networkId)
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
    dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isSigned: true, raw }))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('signTransaction error: ', error)
    dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
    throw error
  }
}

export const sendSignedTransaction = ({ web3, entry }) => async (dispatch, getState) => {
  dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isPending: true }))

  // eslint-disable-next-line
  entry = pendingEntrySelector(entry.tx.from, entry.key)(getState())

  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(entry.raw)
      .on('transactionHash', (hash) => {
        dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isSent: true, hash }))
      })
      .on('receipt', (receipt) => {
        dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isMined: true, receipt }))
        resolve(receipt)
      })
      .on('error', (error) => {
        dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
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
      reject: () => dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isRejected: true })),
    },
  }))
}

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isAccepted: true, isPending: true }))

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
