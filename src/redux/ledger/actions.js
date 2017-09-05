import ledgerProvider from 'network/LedgerProvider'
import { NETWORK_SET_ACCOUNTS } from 'redux/network/actions'
import { selectAccount, getProviderURL } from 'redux/network/actions'
import web3Provider from 'network/Web3Provider'

export const LEDGER_SET_U2F = 'ledger/SET_U2F'
export const LEDGER_SET_ETH_APP_OPENED = 'ledger/SET_ETH_APP_OPENED'
export const LEDGER_FETCHING = 'ledger/FETCHING'
export const LEDGER_FETCHED = 'ledger/FETCHED'

export const initLedger = () => async (dispatch) => {
  await ledgerProvider.init()
  dispatch({type: LEDGER_SET_U2F, isU2F: ledgerProvider.isU2F()})
  dispatch({type: LEDGER_SET_ETH_APP_OPENED, isETHAppOpened: ledgerProvider.isETHAppOpened()})
  return ledgerProvider.isInited()
}

export const startLedgerSync = () => async (dispatch) => {
  await dispatch(initLedger())
  ledgerProvider.on('connection', (isETHAppOpened) => dispatch({type: LEDGER_SET_ETH_APP_OPENED, isETHAppOpened}))
  await ledgerProvider.sync()
}

export const stopLedgerSync = (isReset = false) => (dispatch) => {
  ledgerProvider.stop()
  if (!isReset) {
    return
  }
  // reset state if we do not intent to login
  dispatch({type: NETWORK_SET_ACCOUNTS, accounts: []})
  dispatch(selectAccount(null))
  dispatch({type: LEDGER_FETCHED, isFetched: false})
}

export const fetchAccount = () => async (dispatch) => {
  dispatch({type: LEDGER_FETCHING})
  const accounts = await ledgerProvider.fetchAccount()
  if (!accounts) {
    dispatch({type: LEDGER_FETCHED, isFetched: false})
    return
  }
  dispatch({type: NETWORK_SET_ACCOUNTS, accounts})
  dispatch(selectAccount(accounts[0]))
  dispatch({type: LEDGER_FETCHED, isFetched: true})
  // we do not need to watching eth app on login
  dispatch(stopLedgerSync())
}

export const loginLedger = () => (dispatch) => {
  const providerURL = dispatch(getProviderURL())
  ledgerProvider.setupAndStart(providerURL)
  web3Provider.setWeb3(ledgerProvider.getWeb3())
  web3Provider.setProvider(ledgerProvider.getProvider())
}
