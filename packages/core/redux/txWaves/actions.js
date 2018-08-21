/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as WavesTxActionTypes from './constants'

export const wavesTxCreate = () => ({
  type: WavesTxActionTypes.WAVES_TX_CREATE,
})

export const wavesTxReset = () => ({
  type: WavesTxActionTypes.WAVES_TX_RESET,
})

export const wavesTxStatus = () => ({
  type: WavesTxActionTypes.WAVES_TX_STATUS,
})

export const wavesTxUpdate = () => ({
  type: WavesTxActionTypes.WAVES_TX_UPDATE,
})
