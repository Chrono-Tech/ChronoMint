export const NETWORK_SET_WEB3 = 'network/SET_WEB3'
export const NETWORK_SET_ACCOUNTS = 'network/SET_ACCOUNTS'
export const NETWORK_SELECT_ACCOUNT = 'networl/SELECT_ACCOUNT'
export const NETWORK_ADD_ERROR = 'network/ADD_ERROR'
export const NETWORK_CLEAR_ERRORS = 'network/CLEAR_ERRORS'
export const NETWORK_SET_TEST_RPC = 'network/SET_TEST_RPC'
export const NETWORK_SET_TEST_METAMASK = 'network/SET_METAMASK'

const initialState = {
  accounts: [],
  errors: [],
  selectedProvider: null,
  selectedAccount: null,
  isTestRPC: false,
  isMetaMask: false
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
    case NETWORK_SET_TEST_METAMASK:
      return {...state, isMetaMask: action.isMetaMask}
    case NETWORK_SET_ACCOUNTS:
      return {...state, accounts: action.accounts}
    case NETWORK_SELECT_ACCOUNT:
      return {...state, selectedAccount: action.selectedAccount}
    case NETWORK_CLEAR_ERRORS:
      return {...state, errors: []}
    case NETWORK_ADD_ERROR:
      return {
        ...state,
        errors: [...state.errors, action.error]
      }
    default:
      return state
  }
}

export default reducer
