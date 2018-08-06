/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import trezorProvider from '../../network/TrezorProvider'
import networkService from '../../network/NetworkService'
import { NETWORK_SET_ACCOUNTS } from '../../redux/network/constants'

export const TREZOR_SET_U2F = 'trezor/SET_U2F'
export const TREZOR_FETCHING = 'trezor/FETCHING'
export const TREZOR_FETCHED = 'trezor/FETCHED'

export const initTrezor = () => async (dispatch) => {
  const isInited = await trezorProvider.init()
  dispatch({ type: TREZOR_SET_U2F, isU2F: trezorProvider.isU2F() })
  return isInited
}

export const startTrezorSync = () => async (dispatch) => {
  await dispatch(initTrezor())
}

export const stopTrezorSync = (isReset = false) => (dispatch) => {
  trezorProvider.stop()
  if (!isReset) {
    return
  }
  // reset state if we do not intent to login
  dispatch({ type: NETWORK_SET_ACCOUNTS, accounts: [] })
  networkService.selectAccount(null)
  dispatch({ type: TREZOR_FETCHED, isFetched: false })
}

export const fetchAccount = () => async (dispatch) => {
  dispatch({ type: TREZOR_FETCHING })
  const accounts = await trezorProvider.fetchAccount()
  if (!accounts) {
    dispatch({ type: TREZOR_FETCHED, isFetched: false })
    return
  }
  dispatch({ type: NETWORK_SET_ACCOUNTS, accounts })
  networkService.selectAccount(accounts[ 0 ])
  dispatch({ type: TREZOR_FETCHED, isFetched: true })
  // we do not need to watching eth app on login
  dispatch(stopTrezorSync())
}
