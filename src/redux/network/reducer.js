import { providerMap, getNetworksByProvider } from '../../network/settings'
import {
  NETWORK_SET_ACCOUNTS,
  NETWORK_CLEAR_ERRORS,
  NETWORK_ADD_ERROR,
  NETWORK_SELECT_ACCOUNT,
  NETWORK_SET_TEST_RPC,
  NETWORK_SET_TEST_METAMASK,
  NETWORK_SET_NETWORK,
  NETWORK_SET_PROVIDER
} from './actions'

const initialState = {
  isLocal: false,
  accounts: [],
  selectedAccount: null,
  errors: [],
  providers: [
    providerMap.infura,
    providerMap.metamask,
    providerMap.uport,
    providerMap.local
  ],
  selectedProviderId: null,
  networks: [],
  selectedNetworkId: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NETWORK_SET_TEST_RPC:
      providerMap.local.disabled = false
      return {
        ...state,
        isLocal: true,
        // update state
        providers: [...state.providers]
      }
    case NETWORK_SET_TEST_METAMASK:
      providerMap.metamask.disabled = false
      return {
        ...state,
        providers: [...state.providers]
      }
    case NETWORK_SET_NETWORK:
      return {...state, selectedNetworkId: action.selectedNetworkId}
    case NETWORK_SET_PROVIDER:
      return {...state,
        selectedProviderId: action.selectedProviderId,
        networks: getNetworksByProvider(action.selectedProviderId, state.isLocal)
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
