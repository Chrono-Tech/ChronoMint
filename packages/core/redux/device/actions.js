/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EthereumTrezorDevice from '../../services/signers/EthereumTrezorDevice'
import EthereumLedgerDevice from '../../services/signers/EthereumLedgerDevice'
import MetamaskPlugin from '../../services/signers/MetamaskPlugin'
import { accountLoad } from '../persistAccount/actions'
import {
  AccountModel,
} from '../../models'
import {
  DEVICE_ADD,
  DEVICE_SELECT,
  DEVICE_DESELECT,
  DEVICE_UPDATE_LIST,
  DEVICE_LOAD,
  DEVICE_STATE_LOADING,
  DEVICE_STATE_LOADED,
  DEVICE_STATE_ERROR,
  DEVICE_CLEAR_LIST,
} from './constants'
import { updateSessionWeb3 } from '../session/thunks'

export const deviceAdd = (wallet) => (dispatch) => {
  dispatch({ type: DEVICE_ADD, wallet })
}

export const deviceSelect = (wallet) => (dispatch) => {
  dispatch({ type: DEVICE_SELECT, wallet })
}

export const deviceDeselect = (wallet) => (dispatch) => {
  dispatch({ type: DEVICE_DESELECT, wallet })
}

export const deviceLoad = (wallet) => (dispatch) => {
  dispatch({ type: DEVICE_LOAD, wallet })
}

export const deviceUpdateList = (deviceList) => (dispatch) => {
  dispatch({ type: DEVICE_UPDATE_LIST, deviceList })
}

export const deviceClearList = () => (dispatch) => {
  dispatch({ type: DEVICE_CLEAR_LIST })
}

// eslint-disable-next-line no-unused-vars
export const initLedgerDevice = (wallet) => async (dispatch) => {
  await dispatch(updateSessionWeb3())
  const ledger = new EthereumLedgerDevice()
  const result = await ledger.getAddressInfoList(0, 5)
  dispatch(deviceUpdateList(result))
}

// eslint-disable-next-line no-unused-vars
export const initTrezorDevice = (wallet) => async (dispatch) => {
  try {
    dispatch(deviceUpdateList())
    dispatch({ type: DEVICE_STATE_LOADING })
    await dispatch(updateSessionWeb3())
    const trezor = new EthereumTrezorDevice()
    const result = await trezor.getAccountInfoList(0, 5)
    dispatch(deviceUpdateList(result))
    dispatch({ type: DEVICE_STATE_LOADED })
  } catch (e) {
    //eslint-disable-next-line
    console.error(e)
    dispatch({ type: DEVICE_STATE_ERROR })
  }
}

// eslint-disable-next-line no-unused-vars
export const initMetamaskPlugin = (wallet) => async (dispatch) => {
  const metamask = new MetamaskPlugin()
  await metamask.init()
  const result = await metamask.getAddressInfoList()
  dispatch(deviceUpdateList(result))
}

export const loadDeviceAccount = (entry) => async (dispatch) => {
  const wallet = new AccountModel({
    entry,
  })
  await dispatch(accountLoad(wallet))

  return wallet
}

// eslint-disable-next-line no-unused-vars
export const deviceNextPage = () => (dispatch) => {
  // TODO
}
