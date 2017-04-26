import { providerMap, getNetworksByProvider, infuraLocalNetwork } from '../../network/networkSettings'

export const NETWORK_SET_ACCOUNTS = 'network/SET_ACCOUNTS'
export const NETWORK_SELECT_ACCOUNT = 'network/SELECT_ACCOUNT'
export const NETWORK_ADD_ERROR = 'network/ADD_ERROR'
export const NETWORK_CLEAR_ERRORS = 'network/CLEAR_ERRORS'
export const NETWORK_SET_TEST_RPC = 'network/SET_TEST_RPC'
export const NETWORK_SET_TEST_METAMASK = 'network/SET_TEST_METAMASK'
export const NETWORK_SET_NETWORK = 'network/SET_NETWORK'
export const NETWORK_SET_PROVIDER = 'network/SET_PROVIDER'

const initialState = {
  isLocal: false,
  accounts: [],
  selectedAccount: null,
  errors: [],
  providers: [providerMap.infura],
  selectedProviderId: null,
  networks: [],
  selectedNetworkId: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NETWORK_SET_TEST_RPC:
      return {
        ...state,
        isLocal: true,
        providers: [...state.providers, providerMap.local]
      }
    case NETWORK_SET_TEST_METAMASK:
      return {
        ...state,
        providers: [...state.providers, providerMap.metamask]
      }
    case NETWORK_SET_NETWORK:
      return {...state, selectedNetworkId: action.selectedNetworkId}
    case NETWORK_SET_PROVIDER:
      const networks = getNetworksByProvider(action.selectedProviderId)
      if (state.isLocal && action.selectedProviderId === providerMap.infura.id) {
        networks.push(infuraLocalNetwork)
      }
      return {...state,
        selectedProviderId: action.selectedProviderId,
        networks
      }
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
