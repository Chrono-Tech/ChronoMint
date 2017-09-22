import { providerMap, getNetworksByProvider } from 'Login/network/settings'
import * as actions from './actions'

const initialState = {
  isLoading: false,
  isLocal: false,
  accounts: [],
  selectedAccount: null,
  errors: [],
  providers: [
    providerMap.chronoBank,
    providerMap.infura,
    providerMap.metamask,
    providerMap.uport,
    providerMap.local
  ],
  selectedProviderId: null,
  networks: [],
  selectedNetworkId: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.NETWORK_LOADING:
      return {
        ...state,
        isLoading: action.isLoading
      }
    case actions.NETWORK_SET_TEST_RPC:
      return {
        ...state,
        isLocal: true,
        providers: state.providers.map(item => item.id === providerMap.local.id
          ? {
            ...item,
            disabled: false
          }
          : item
        )
      }
    case actions.NETWORK_SET_TEST_METAMASK:
      return {
        ...state,
        providers: state.providers.map(item => item.id === providerMap.metamask.id
          ? {
            ...item,
            disabled: false
          }
          : item
        )
      }
    case actions.NETWORK_SET_NETWORK:
      return {...state, selectedNetworkId: action.selectedNetworkId}
    case actions.NETWORK_SET_PROVIDER:
      return {
        ...state,
        selectedProviderId: action.selectedProviderId,
        networks: getNetworksByProvider(action.selectedProviderId, state.isLocal)
      }
    case actions.NETWORK_SET_ACCOUNTS:
      return {...state, accounts: action.accounts}
    case actions.NETWORK_SELECT_ACCOUNT:
      return {...state, selectedAccount: action.selectedAccount}
    case actions.NETWORK_CLEAR_ERRORS:
      return {...state, errors: []}
    case actions.NETWORK_ADD_ERROR:
      return {
        ...state,
        isLoading: false,
        errors: [...state.errors, action.error]
      }
    default:
      return state
  }
}
