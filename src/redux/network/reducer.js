import { providerMap, getNetworksByProvider } from '../../network/settings'
import * as actions from './actions'

const initialState = {
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.NETWORK_SET_TEST_RPC:
      providerMap.local.disabled = false
      return {
        ...state,
        isLocal: true,
        // update state
        providers: [...state.providers]
      }
    case actions.NETWORK_SET_TEST_METAMASK:
      providerMap.metamask.disabled = false
      return {
        ...state,
        providers: [...state.providers]
      }
    case actions.NETWORK_SET_NETWORK:
      return {...state, selectedNetworkId: action.selectedNetworkId}
    case actions.NETWORK_SET_PROVIDER:
      return {...state,
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
        errors: [...state.errors, action.error]
      }
    default:
      return state
  }
}

export default reducer
