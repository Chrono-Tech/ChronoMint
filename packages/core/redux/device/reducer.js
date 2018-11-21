/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as a from './constants'

const initialState = {
  deviceList: [],
  selectedDevice: null,
  isLoading: false,
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
    case a.STATE_LOADING:
      return {
        ...state,
        status: a.STATE_LOADING,
      }
    case a.STATE_LOADED:
      return {
        ...state,
        status: a.STATE_LOADED,
      }
    case a.STATE_ERROR:
      return {
        ...state,
        status: a.STATE_ERROR,
      }

    default:
      return state
  }
}
