export const NETWORK_SET_WEB3 = 'network/SET_WEB3'
export const NETWORK_SET_ACCOUNTS = 'network/SET_ACCOUNTS'
export const NETWORK_SELECT_ACCOUNT = 'networl/SELECT_ACCOUNT'
export const NETWORK_ERROR_ACCOUNTS_FETCH = 'network/ERROR_ACCOUNT_FETCH'
export const NETWORK_ERROR_NO_ACCOUNTS = 'network/ERROR_NO_ACCOUNT'
export const NETWORK_SET_TEST_RPC = 'network/SET_TEST_RPC'

const initialState = {
  accounts: [],
  error: null,
  selectedProvider: null,
  selectedAccount: null,
  isTestRPC: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NETWORK_SET_WEB3:
      return {
        ...state,
        selectedProvider: action.providerName
      }
    case NETWORK_SET_TEST_RPC:
      return {...state, isTestRPC: action.isTestRPC}
    case NETWORK_SET_ACCOUNTS:
      return {...state, accounts: action.accounts}
    case NETWORK_SELECT_ACCOUNT:
      return {...state, selectedAccount: action.selectedAccount}
    case NETWORK_ERROR_ACCOUNTS_FETCH:
    case NETWORK_ERROR_NO_ACCOUNTS:
      return {...state, error: action.error}
    default:
      return state
  }
}

export default reducer
