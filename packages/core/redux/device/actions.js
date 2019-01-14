/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  DEVICE_UPDATE_LIST,
  DEVICE_CLEAR_LIST,
  CLEAR_WEB3_INSTANCE,
  SET_WEB3_INSTANCE,
} from './constants'

export const deviceUpdateList = (deviceList) => (dispatch) => {
  dispatch({ type: DEVICE_UPDATE_LIST, deviceList })
}

export const deviceClearList = () => (dispatch) => {
  dispatch({ type: DEVICE_CLEAR_LIST })
}

export const updateSessionWeb3 = (web3) => (dispatch) => {
  dispatch({ type: SET_WEB3_INSTANCE, web3 })
}

export const clearSessionWeb3 = () => (dispatch) => {
  dispatch({ type: CLEAR_WEB3_INSTANCE })
}
