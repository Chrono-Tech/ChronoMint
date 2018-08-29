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

    case a.DEVICE_SET_STATUS:
      return {
        ...state,
        isLoading: action.deviceStatus,
      }

    default:
      return state
  }
}
