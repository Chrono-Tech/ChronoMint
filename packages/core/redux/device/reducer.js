/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as a from './constants'

const initialState = {
  deviceList: [],
  selectedDevice: null,
  status: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.DEVICE_SELECT:
      return {
        ...state,
        selectedWallet: action.wallet,
      }
    case a.DEVICE_UPDATE_LIST:
      return {
        ...state,
        deviceList: action.deviceList,
      }
    case a.DEVICE_CLEAR_LIST:
      return {
        ...state,
        deviceList: [],
      }
    case a.DEVICE_STATE_LOADING:
      return {
        ...state,
        status: a.STATE_LOADING,
      }
    case a.DEVICE_STATE_LOADED:
      return {
        ...state,
        status: a.STATE_LOADED,
      }
    case a.DEVICE_STATE_ERROR:
      return {
        ...state,
        status: a.STATE_ERROR,
      }

    default:
      return state
  }
}
