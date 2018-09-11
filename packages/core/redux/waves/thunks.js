/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as WavesUtils from './utils'
import * as WavesActions from './actions'
import { getToken } from '../tokens/selectors'
import { modalsOpen } from '../modals/actions'
import { getWavesSigner, pendingEntrySelector } from './selectors'

export const executeWavesTransaction = ({ tx, options }) => async (dispatch) => {
  dispatch(WavesActions.wavesTxAccept({ tx, options }))
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
    const signedEntry = await dispatch(signTransaction({ entry, signer }))
    if (!signedEntry) {
      // eslint-disable-next-line no-console
      console.error('signedEntry is null', entry)
      return null // stop execute
    }
    return dispatch(sendSignedTransaction(signedEntry))
  } catch (error) {
    throw error
  }
}