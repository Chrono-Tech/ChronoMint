/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ledgerProvider from '../../network/LedgerProvider'
import web3Provider from '../../network/Web3Provider'
import networkService from '../../network/NetworkService'
import { NETWORK_SET_ACCOUNTS } from '../../redux/network/constants'
import {
  LEDGER_FETCHED,
  LEDGER_FETCHING,
  LEDGER_SET_ETH_APP_OPENED,
  LEDGER_SET_U2F,
} from './constants'

export const initLedger = () => async (dispatch) => {
  const isInited = await ledgerProvider.init()
  dispatch({ type: LEDGER_SET_U2F, isU2F: ledgerProvider.isU2F() })
  dispatch({ type: LEDGER_SET_ETH_APP_OPENED, isETHAppOpened: ledgerProvider.isETHAppOpened() })
  return isInited
}

export const startLedgerSync = () => async (dispatch) => {
  await dispatch(initLedger())
  return ledgerProvider
    .on('connection', (isETHAppOpened) => dispatch({ type: LEDGER_SET_ETH_APP_OPENED, isETHAppOpened }))
    .sync()
}

export const stopLedgerSync = (isReset = false) => (dispatch) => {
  ledgerProvider.stop()
  if (!isReset) {
    return
  }
  // reset state if we do not intent to login
  dispatch({ type: NETWORK_SET_ACCOUNTS, accounts: [] })
  networkService.selectAccount(null)
  dispatch({ type: LEDGER_FETCHED, isFetched: false })
}

export const fetchAccount = () => async (dispatch) => {
  dispatch({ type: LEDGER_FETCHING })
  const accounts = await ledgerProvider.fetchAccount()
  if (!accounts) {
    dispatch({ type: LEDGER_FETCHED, isFetched: false })
    return
  }
  dispatch({ type: NETWORK_SET_ACCOUNTS, accounts })
  dispatch({ type: LEDGER_FETCHED, isFetched: true })
  // we do not need to watching eth app on login
  dispatch(stopLedgerSync())
}
