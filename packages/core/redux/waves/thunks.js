/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as WavesUtils from './utils'
import * as WavesActions from './actions'
import { getToken } from '../tokens/selectors'
import { modalsOpen } from '../modals/actions'
import { getWavesSigner, pendingEntrySelector } from './selectors'
import { describePendingWavesTx } from '../../describers'
import { getSelectedNetwork } from '../persistAccount/selectors'
import TxExecModel from '../../models/TxExecModel'
import { DUCK_TOKENS } from '../tokens/constants'
import tokenService from '../../services/TokenService'

export const executeWavesTransaction = ({ tx, options }) => async (dispatch, getState) => {
  console.log('executeWavesTransaction: ', tx, options)
  const state = getState()
  const token = getToken(options.symbol)(state)
  const network = getSelectedNetwork()(state)
  const prepared = dispatch(WavesUtils.prepareWavesTransaction(tx, token, network))
  const entry = WavesUtils.createWavesTxEntryModel({ tx: prepared }, options)
  console.log('entry: ', entry)

  await dispatch(WavesActions.wavesTxCreate(entry))
  dispatch(submitTransaction(entry, options))
}

const submitTransaction = (entry) => async (dispatch, getState) => {
  const state = getState()
  const description = describePendingWavesTx(
    entry,
    {
      token: getToken(entry.symbol)(state),
    })

  dispatch(modalsOpen({
    componentName: 'ConfirmTxDialog',
    props: {
      entry,
      description,
      accept: acceptTransaction,
      reject: (entry) => (dispatch) => dispatch(WavesActions.wavesTxReject(entry)),
    },
  }))
}

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch(WavesActions.wavesTxAccept(entry))

  const state = getState()
  const signer = getWavesSigner(state, entry.blockchain)

  const selectedEntry = pendingEntrySelector(entry.tx.from, entry.key, entry.blockchain)(state)
  if (!selectedEntry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return // stop execute
  }

  try {
    return dispatch(processTransaction({
      entry: selectedEntry,
      signer,
    }))
  } catch (error) {
    throw error
  }
}

const processTransaction = ({ entry, signer }) => async (dispatch) => {
  try {
    dispatch(WavesActions.wavesTxProcessTransaction({ entry, signer }))
    const signedEntry = await dispatch(signTransaction({ entry, signer }))
    if (!signedEntry) {
      // eslint-disable-next-line no-console
      console.error('signedEntry is null', entry)
      return null
    }

    return dispatch(sendSignedTransaction(signedEntry))
  } catch (error) {
    throw error
  }
}

const signTransaction = ({ entry, signer }) => async (dispatch) => {
  try {
    console.log('signTransaction: ', entry, signer)
    dispatch(WavesActions.wavesTxSignTransaction({ entry, signer }))

    const signedPreparedTx = await signer.signTransaction(entry.tx.prepared)
    const newEntry = WavesUtils.createWavesTxEntryModel({ ...entry, tx: new TxExecModel({
      ...entry.tx,
      prepared: signedPreparedTx,
    }),
    })

    return newEntry
  } catch (error) {
    console.log('signTransaction error: ', error)
    dispatch(WavesActions.wavesTxSignTransactionError({ error }))
    throw error
  }
}

// TODO: need to continue rework of this method. Pushed to merge with other changes.
const sendSignedTransaction = (entry) => async (dispatch, getState) => {
  console.log('sendSignedTransaction: ', entry)
  if (!entry) {
    const error = new Error('Can\'t send empty Tx. There is no entry at WAVES sendSignedTransaction')
    throw new Error(error)
  }

  const state = getState()
  const token = state.get(DUCK_TOKENS).item(entry.symbol)

  const dao = tokenService.getDAO(token)
  console.log('daodao: ', dao)

  try {

    const sendResult = await dao._wavesProvider.justTransfer(entry.from, entry.tx.prepared)
    console.log('sendResult: ', sendResult)

    return
  } catch (e) {
    console.log('Send WAVES errors: ', e)
  }
}
