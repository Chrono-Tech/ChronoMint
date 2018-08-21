/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TrezorDevice from '../../services/signers/TrezorDevice.js'
import TrezorDeviceMock from '../../services/signers/TrezorDeviceMock.js'
import LedgerDevice from '../../services/signers/LedgerDevice.js'
import LedgerDeviceMock from '../../services/signers/LedgerDeviceMock.js'
import BitcoinMemoryDevice from '../../services/signers/BitcoinMemoryDevice.js'
import { accountLoad } from '../persistAccount/actions'
import {
  AccountModel,
  DeviceEntryModel,
  SignerModel,
} from '../../models'
import {
  DUCK_DEVICE_ACCOUNT,
  DEVICE_ADD,
  DEVICE_SELECT,
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
  dispatch({ type: DEVICE_SET_STATUS, deviceStatus})
}

export const onDeviceSelect = (wallet) => (dispatch) => {

  dispatch(PersistAccountActions.accountSelect(wallet))
  dispatch(LoginUIActions.navigateToLoginPage())
}

export const initLedgerDevice = (wallet) => async (dispatch, getState) => {
  console.log('initLedgerDevice')
  let wallets = []
  const ledger = new TrezorDeviceMock()
  const result = await ledger.init()
  console.log(result)
  wallets.push(result)
  dispatch(deviceUpdateList(wallets))
  const deviceStatus = ledger.isConnected
  console.log(deviceStatus)
  dispatch(deviceSetStatus(deviceStatus))
}

export const initTrezorDevice = (wallet) => async (dispatch, getState) => {
  console.log('initTrezorDevice')
  let wallets = []
  const trezor = new TrezorDeviceMock()
  const result = await trezor.init()
  console.log(result)
  wallets.push(result)
  dispatch(deviceUpdateList(wallets))
  const deviceStatus = trezor.isConnected
  console.log(deviceStatus)
  dispatch(deviceSetStatus(deviceStatus))

}

export const initMemoryDevice = (wallet, password) => async (dispatch, getState) => {

}

export const loadDeviceAccount = (entry) => async (dispatch) => {
  let device;
  console.log('load device account')
  switch(entry.encrypted[0].type) {
    case 'trezor_mock' : {
      device = new TrezorDeviceMock()
    }
  }
  try {
  const btc = new BitcoinMemoryDevice()
  btc.buildTx()
  } catch (e) { console.log(e) }
  device.init()
  const wallet = new AccountModel({
    entry,
    signers: { ethereum: device },
  })
  await dispatch(accountLoad(wallet))

  return wallet
}

export const deviceNextPage = () => (dispatch, getState) => {
  

}
