/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EthereumTrezorDevice from '../../services/signers/EthereumTrezorDevice'
import EthereumLedgerDevice from '../../services/signers/EthereumLedgerDevice'
import EventService from '../../services/EventService'
import MetamaskPlugin from '../../services/signers/MetamaskPlugin'
import { accountLoad } from '../persistAccount/actions'
import {
  AccountModel,
} from '../../models'
import {
  DEVICE_STATE_LOADING,
  DEVICE_STATE_LOADED,
  DEVICE_STATE_ERROR,
} from './constants'
import { EVENT_LEDGER_REINIT_DEVICE } from '../events/constants'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { DUCK_PERSIST_ACCOUNT } from '../persistAccount/constants'
import { getNetworkById } from '@chronobank/login/network/settings'
import web3Factory from '../../web3'
import * as DeviceActions from './actions'
import { DUCK_SESSION } from '../session/constants'

/**
 * At the moment it used only for Trezor login page. Getting addresses balances
 * @param selectedNetworkId
 * @param selectedProviderId
 * @returns {function(*=, *): Promise<any>}
 */
export const updateSessionWeb3 = (selectedNetworkId, selectedProviderId) => (dispatch, getState) => {
  const state = getState()
  if (!selectedNetworkId || !selectedProviderId) {
    const network = state.get(DUCK_NETWORK)
    selectedNetworkId = network.selectedNetworkId
    selectedProviderId = network.selectedProviderId
  }

  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
  let network = getNetworkById(selectedNetworkId, selectedProviderId)

  if (!network.id) {
    network = customNetworksList.find((network) => network.id === selectedNetworkId)
  }

  return new Promise((resolve, fail) => {
    const web3 = web3Factory(network)
    web3.eth.net.isListening().then(() => {
      dispatch(DeviceActions.updateSessionWeb3(web3))
      resolve()
    }).catch((e) => {
      fail(e)
    })
  })
}

/**
 * Close session web3 connection and remove it from the store. At the moment used only for Trezor login
 */
export const clearSessionWeb3 = () => (dispatch, getState) => {
  dispatch(DeviceActions.clearSessionWeb3())

  const web3 = getState().get(DUCK_SESSION).web3
  web3.currentProvider.disconnect()
}

// eslint-disable-next-line no-unused-vars
export const initLedgerDevice = () => async (dispatch) => {
  try {
    dispatch(DeviceActions.deviceClearList())
    dispatch({ type: DEVICE_STATE_LOADING })
    await dispatch(updateSessionWeb3())
    const ledger = new EthereumLedgerDevice()
    const result = await ledger.getAddressInfoList(0, 5)
    dispatch(DeviceActions.deviceUpdateList(result))
    dispatch({ type: DEVICE_STATE_LOADED })
  } catch (e) {
    //eslint-disable-next-line
    console.error(e)
    dispatch({ type: DEVICE_STATE_ERROR })
    EventService.emit(EVENT_LEDGER_REINIT_DEVICE)
  }
}

// eslint-disable-next-line no-unused-vars
export const initTrezorDevice = () => async (dispatch) => {
  try {
    dispatch(DeviceActions.deviceClearList())
    dispatch({ type: DEVICE_STATE_LOADING })
    await dispatch(updateSessionWeb3())
    const trezor = new EthereumTrezorDevice()
    const result = await trezor.getAccountInfoList(0, 5)
    dispatch(DeviceActions.deviceUpdateList(result))
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
  dispatch(DeviceActions.deviceUpdateList(result))
}

export const loadDeviceAccount = (entry) => async (dispatch) => {
  const wallet = new AccountModel({
    entry,
  })
  await dispatch(accountLoad(wallet))

  return wallet
}
