/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { modalsOpen, modalsClose } from '@chronobank/core-dependencies/redux/modals/actions'
import * as WavesTxActions from './actions'
import { createTxEntry } from './utils'
import WavesDAO from '../../dao/WavesDAO'

// eslint-disable-next-line import/prefer-default-export
export const executeTransactionWaves = (
  walletAddress,
  walletDerivedPath,
  recipient,
  amount,
  token,
  feeMultiplier,
) => (dispatch) => {
  const txEntry = createTxEntry(
    walletAddress,
    walletDerivedPath,
    recipient,
    amount,
    token,
    feeMultiplier,
  )
  dispatch(WavesTxActions.wavesTxCreate(txEntry))
    .then(() => {
      dispatch(modalsOpen({
        componentName: 'ConfirmTxDialog',
        props: {
          tx: txEntry,
          dao: WavesDAO,
          confirm: (tx) => dispatch(acceptWavesTx(tx)),
          reject: () => dispatch(rejectWavesTx()),
        },
      }))
    })
}

const acceptWavesTx = (txEntry) => (dispatch) => {
  dispatch(WavesTxActions.wavesTxStatus(txEntry))
  dispatch(modalsClose({ componentName: 'ConfirmTxDialog' }))
}

const rejectWavesTx = () => (dispatch) => {
  dispatch(modalsClose({ componentName: 'ConfirmTxDialog' }))
  dispatch(WavesTxActions.wavesTxReset())
}
