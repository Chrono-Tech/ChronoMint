import reducer, * as actions from '../../../src/redux/network/networkReducer'
import web3Provider from '../../../src/network/Web3Provider'
import { providerMap, networkMap } from '../../../src/network/networkSettings'

let accounts, selectedAccount

describe('network reducer', () => {
  beforeAll(done => {
    web3Provider.getWeb3().then(web3 => {
      accounts = web3.eth.accounts
      selectedAccount = accounts[2]
      done()
    })
  })

  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toEqual({
        accounts: [],
        errors: [],
        providers: [providerMap.infura],
        networks: [networkMap.ropsten, networkMap.morden],
        selectedProviderId: null,
        selectedNetworkId: null,
        selectedAccount: null
      })
  })

  it('should handle NETWORK_SET_WEB3', () => {
    expect(reducer({}, {type: actions.NETWORK_SET_WEB3, selectedProviderId: providerMap.metamask.id}))
      .toEqual({
        selectedProviderId: providerMap.metamask.id
      })
  })

  it('should handle NETWORK_SET_TEST_RPC', () => {
    const initialState = {
      providers: [],
      networks: []
    }
    expect(reducer(initialState, {type: actions.NETWORK_SET_TEST_RPC}))
      .toEqual({
        providers: [providerMap.local],
        networks: [networkMap.local]
      })
  })

  it('should handle NETWORK_SET_NETWORK', () => {
    expect(reducer({}, {type: actions.NETWORK_SET_NETWORK, selectedNetworkId: 2}))
      .toEqual({
        selectedNetworkId: 2
      })
  })

  it('should handle NETWORK_SET_PROVIDER', () => {
    expect(reducer({}, {type: actions.NETWORK_SET_PROVIDER, selectedProviderId: 2}))
      .toEqual({
        selectedProviderId: 2
      })
  })

  it('should handle NETWORK_SET_ACCOUNTS', () => {
    expect(reducer({}, {type: actions.NETWORK_SET_ACCOUNTS, accounts}))
      .toEqual({
        accounts
      })
  })

  it('should handle NETWORK_SELECT_ACCOUNT', () => {
    expect(reducer({}, {type: actions.NETWORK_SELECT_ACCOUNT, selectedAccount}))
      .toEqual({
        selectedAccount
      })
  })

  it('should handle NETWORK_ADD_ERROR', () => {
    const initialState = { errors: ['bug', 'warning'] }
    expect(reducer(initialState, {type: actions.NETWORK_ADD_ERROR, error: 'feature'}))
      .toEqual({
        errors: ['bug', 'warning', 'feature']
      })
  })

  it('should handle NETWORK_CLEAR_ERRORS', () => {
    const initialState = { errors: ['bug', 'warning'] }
    expect(reducer(initialState, {type: actions.NETWORK_CLEAR_ERRORS}))
      .toEqual({
        errors: []
      })
  })
})
