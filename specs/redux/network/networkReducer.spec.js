import reducer, * as actions from '../../../src/redux/network/networkReducer'
import web3ProviderNames from '../../../src/network/Web3ProviderNames'
import web3Provider from '../../../src/network/Web3Provider'
import { networkMap, providerMap } from '../../../src/network/networkSettings'

const accounts = web3Provider.getWeb3instance().eth.accounts
const selectedAccount = accounts[2]

describe('network reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toEqual({
        accounts: [],
        errors: [],
        selectedProvider: null,
        selectedAccount: null,
        isTestRPC: false,
        isMetaMask: false
      })
  })

  it('should handle NETWORK_SET_WEB3', () => {
    expect(reducer({}, {type: actions.NETWORK_SET_WEB3, providerName: web3ProviderNames.LOCAL}))
      .toEqual({
        selectedProvider: web3ProviderNames.LOCAL
      })
  })

  it('should handle NETWORK_SET_TEST_RPC', () => {
    expect(reducer({}, {type: actions.NETWORK_SET_TEST_RPC, isTestRPC: true}))
      .toEqual({
        isTestRPC: true
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
