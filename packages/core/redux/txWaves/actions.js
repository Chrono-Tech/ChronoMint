/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as WavesTxActionTypes from './constants'

export const wavesTxCreate = (txEntry) => ({
  type: WavesTxActionTypes.WAVES_TX_CREATE,
  txEntry,
})

export const wavesTxReset = () => ({
  type: WavesTxActionTypes.WAVES_TX_RESET,
})

export const wavesTxStatus = (payload) => ({
  type: WavesTxActionTypes.WAVES_TX_STATUS,
  payload,
})

export const wavesTxUpdate = (payload) => ({
  type: WavesTxActionTypes.WAVES_TX_UPDATE,
  payload,
})
