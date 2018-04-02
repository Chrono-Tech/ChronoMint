import { getNetworksByProvider, providerMap } from '../../network/settings'
import * as actions from './actions'

const initialState = {
  isLoading: false,
  isLocal: false,
  isMetamask: false,
  accounts: [],
  selectedAccount: null,
  errors: [],
  providers: [
    providerMap.chronoBank,
    providerMap.infura,
    providerMap.mew,
    providerMap.giveth,
  ],
  priority: [
    providerMap.infura.id,
    providerMap.chronoBank.id,
    providerMap.mew.id,
    providerMap.giveth.id,
  ],
  preferMainnet: process.env.NODE_ENV === 'production',
  selectedProviderId: null,
  networks: [],
  selectedNetworkId: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.NETWORK_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      }
    case actions.NETWORK_SET_TEST_RPC:
      return {
        ...state,
        isLocal: true,
      }
    case actions.NETWORK_SET_TEST_METAMASK:
      return {
        ...state,
        isMetamask: true,
      }
    case actions.NETWORK_SET_NETWORK:
      return { ...state, selectedNetworkId: action.selectedNetworkId }
    case actions.NETWORK_SET_PROVIDER:
      return {
        ...state,
        selectedProviderId: action.selectedProviderId,
        networks: getNetworksByProvider(action.selectedProviderId, state.isLocal),
      }
    case actions.NETWORK_SET_ACCOUNTS:
      return { ...state, accounts: action.accounts }
    case actions.NETWORK_SELECT_ACCOUNT:
      return { ...state, selectedAccount: action.selectedAccount }
    case actions.NETWORK_CLEAR_ERRORS:
      return { ...state, errors: [] }
    case actions.NETWORK_ADD_ERROR:
      return {
        ...state,
        isLoading: false,
        errors: [ ...state.errors, action.error ],
      }
    default:
      return state
  }
}
