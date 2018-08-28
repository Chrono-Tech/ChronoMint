/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TrezorDeviceMock from '../../services/signers/TrezorDeviceMock'
import LedgerDeviceMock from '../../services/signers/LedgerDeviceMock'
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
  DEVICE_SET_STATUS,
} from './constants'

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

export const deviceSetStatus = (deviceStatus) => (dispatch) => {
  dispatch({ type: DEVICE_SET_STATUS, deviceStatus })
}

// eslint-disable-next-line no-unused-vars
export const initLedgerDevice = (wallet) => async (dispatch) => {
  const ledger = new LedgerDeviceMock()
  const result = await ledger.getAddressInfoList(0,5)
  dispatch(deviceUpdateList(result))
}

// eslint-disable-next-line no-unused-vars
export const initTrezorDevice = (wallet) => async (dispatch) => {
  const trezor = new TrezorDeviceMock()
  const result = await trezor.getAddressInfoList(0,5)
  dispatch(deviceUpdateList(result))
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
