import trezorProvider from '../../network/TrezorProvider'
import web3Provider from '../../network/Web3Provider'
import networkService, { NETWORK_SET_ACCOUNTS } from '../../redux/network/actions'

export const TREZOR_SET_U2F = 'trezor/SET_U2F'
export const TREZOR_SET_ETH_APP_OPENED = 'trezor/SET_ETH_APP_OPENED'
export const TREZOR_FETCHING = 'trezor/FETCHING'
export const TREZOR_FETCHED = 'trezor/FETCHED'

export const initTrezor = () => async (dispatch) => {
  const isInited = await trezorProvider.init()
  dispatch({ type: TREZOR_SET_U2F, isU2F: trezorProvider.isU2F() })
  dispatch({ type: TREZOR_SET_ETH_APP_OPENED, isETHAppOpened: trezorProvider.isETHAppOpened() })
  return isInited
}

export const startTrezorSync = () => async (dispatch) => {
  await dispatch(initTrezor())
  trezorProvider.on('connection', (isETHAppOpened) => dispatch({ type: TREZOR_SET_ETH_APP_OPENED, isETHAppOpened }))
  return trezorProvider.sync()
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

export const loginTrezor = () => {
  const providerURL = networkService.getProviderURL()
  trezorProvider.setupAndStart(providerURL)
  web3Provider.setWeb3(trezorProvider.getWeb3())
  web3Provider.setProvider(trezorProvider.getProvider())
}
