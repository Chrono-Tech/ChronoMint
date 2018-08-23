/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { SignerMemoryModel } from '../../models'
import { pendingEntrySelector } from './selectors'
import { getSelectedNetworkId, getSelectedNetwork, getSigner } from '../persistAccount/selectors'
import { describePendingNemTx } from '../../describers'
import { getAccount } from '../session/selectors/models'
import * as Actions from './actions'
import * as Utils from './utils'
import { getToken } from '../tokens/selectors'
import TxEntryModel from '../../models/TxEntryModel'

export const executeNemTransaction = ({ tx, options }) => async (dispatch) => {
  const prepared = await dispatch(prepareTransaction({ tx, options }))
  const entry = Utils.createNemTxEntryModel(prepared, options)

  await dispatch(Actions.nemTxCreate(entry))
  dispatch(submitTransaction(entry, options))
}

export const prepareTransaction = ({ tx }) => async (dispatch, getState) => {

  const networkId = getSelectedNetworkId(getState())
  return tx.mosaicDefinition
    ? Utils.describeMosaicTransaction(tx, networkId)
    : Utils.describeXemTransaction(tx, networkId)
}

export const processTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  await dispatch(signTransaction({ entry, signer }))
  return dispatch(sendSignedTransaction({
    entry: pendingEntrySelector(entry.tx.from, entry.key)(getState()),
  }))
}

export const signTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  try {
    const { tx } = entry
    const signed = Utils.createXemTransaction(tx.tx, signer, getSelectedNetwork()(getState()))
    dispatch(Actions.nemTxUpdate(entry.key, entry.tx.from, new TxEntryModel({
      ...entry,
      tx: {
        ...entry.tx,
        signed,
      },
    })))

  } catch (error) {
    dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
    throw error
  }
}

export const sendSignedTransaction = ({ entry }) => async (dispatch, getState) => {
  dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isPending: true }))

  // eslint-disable-next-line
  entry = pendingEntrySelector(entry.tx.from, entry.key)(getState())

  const node = nemProvider.getNode()
  await node.send({ ...entry.tx.signed.tx, fee: entry.tx.signed.fee })
  // TODO create result callback
  // return new Promise((resolve, reject) => {
  //   web3.eth.sendSignedTransaction(entry.raw)
  //     .on('transactionHash', (hash) => {
  //       dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isSent: true, hash }))
  //     })
  //     .on('receipt', (receipt) => {
  //       dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isMined: true, receipt }))
  //       resolve(receipt)
  //     })
  //     .on('error', (error) => {
  //       dispatch(Actions.nemTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
  //       reject(error)
  //     })
  // })
}

const submitTransaction = (entry, options) => async (dispatch, getState) => {

  const state = getState()
  const account = getAccount(state)

  const description = describePendingNemTx(
    entry,
    {
      address: account,
      token: getToken(options.symbol)(state),
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
    entry: pendingEntrySelector(entry.tx.from, entry.key)(state),
    signer,
  }))
}
