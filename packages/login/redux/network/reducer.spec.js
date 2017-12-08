import { accounts } from 'specsInit'
import { providerMap } from '../../network/settings'
import * as actions from './actions'
import reducer from './reducer'

const selectedAccount = accounts[ 2 ]

describe('network reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot()
  })

  it('should handle NETWORK_SET_TEST_RPC', () => {
    const initialState = {
      isLocal: false,
      providers: [ providerMap.local ],
    }
    expect(reducer(initialState, { type: actions.NETWORK_SET_TEST_RPC })).toMatchSnapshot()
  })

  it('should handle NETWORK_SET_TEST_METAMASK', () => {
    const initialState = {
      providers: [ providerMap.metamask ],
    }
    expect(reducer(initialState, { type: actions.NETWORK_SET_TEST_METAMASK }))
      .toMatchSnapshot()
  })

  it('should handle NETWORK_SET_NETWORK', () => {
    expect(reducer({}, { type: actions.NETWORK_SET_NETWORK, selectedNetworkId: 2 })).toMatchSnapshot()
  })

  it('should handle NETWORK_SET_PROVIDER without local', () => {
    const initialState = {
      isLocal: false,
      selectedProviderId: null,
      providers: [ providerMap.metamask ],
      networks: [],
    }
    expect(reducer(initialState, {
      type: actions.NETWORK_SET_PROVIDER,
      selectedProviderId: providerMap.infura.id,
    })).toMatchSnapshot()
  })

  it('should handle NETWORK_SET_PROVIDER with local', () => {
    const initialState = {
      isLocal: true,
      providers: [ providerMap.metamask ],
      networks: [],
      selectedProviderId: null,
    }
    const state = reducer(initialState, { type: actions.NETWORK_SET_TEST_RPC })
    expect(reducer(state, {
      type: actions.NETWORK_SET_PROVIDER,
      selectedProviderId: providerMap.infura.id,
    })).toMatchSnapshot()
  })

  it('should handle NETWORK_SET_ACCOUNTS', () => {
    expect(reducer({}, { type: actions.NETWORK_SET_ACCOUNTS, accounts }))
      .toMatchSnapshot()
  })

  it('should handle NETWORK_SELECT_ACCOUNT', () => {
    expect(reducer({}, { type: actions.NETWORK_SELECT_ACCOUNT, selectedAccount }))
      .toMatchSnapshot()
  })

  it('should handle NETWORK_ADD_ERROR', () => {
    const initialState = { errors: [ 'bug', 'warning' ] }
    expect(reducer(initialState, { type: actions.NETWORK_ADD_ERROR, error: 'feature' }))
      .toMatchSnapshot()
  })

  it('should handle NETWORK_CLEAR_ERRORS', () => {
    const initialState = { errors: [ 'bug', 'warning' ] }
    expect(reducer(initialState, { type: actions.NETWORK_CLEAR_ERRORS }))
      .toMatchSnapshot()
  })
})
