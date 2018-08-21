/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { modalsOpen, modalsClose } from '@chronobank/core-dependencies/redux/modals/actions'

// eslint-disable-next-line import/prefer-default-export
export const executeWavesTransaction = ({ tx, options }) => (dispatch) => {
  dispatch(modalsOpen({
    comnponentName: 'ConfirmTxDialog',
    props: {
      tx,
      options,
      confirm: (tx) => dispatch(acceptWavesTx(tx)),
      reject: (tx) => dispatch(rejectWavesTx(tx)),
    },
  }))
}

const acceptWavesTx = () => (dispatch) => {
  dispatch(modalsClose({ comnponentName: 'ConfirmTxDialog' }))
}

const rejectWavesTx = () => (dispatch) => {
  dispatch(modalsClose({ comnponentName: 'ConfirmTxDialog' }))
  dispatch()
}
