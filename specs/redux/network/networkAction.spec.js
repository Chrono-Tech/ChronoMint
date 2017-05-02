import * as actions from '../../../src/redux/network/actions'
import {
  NETWORK_SET_TEST_RPC,
  NETWORK_SET_TEST_METAMASK,
  NETWORK_SET_ACCOUNTS,
  NETWORK_SELECT_ACCOUNT,
  NETWORK_SET_PROVIDER,
  NETWORK_SET_NETWORK,
  NETWORK_ADD_ERROR,
  NETWORK_CLEAR_ERRORS
} from '../../../src/redux/network/reducer'
import { store, accounts } from '../../init'
import Web3 from 'web3'
import localStorageKeys from '../../../src/constants/localStorageKeys'
import ls from '../../../src/utils/localStorage'
import { providerMap } from '../../../src/network/networkSettings'

describe('network actions', () => {
  // TODO @dkchv: fixed in MINT-165
  it.skip('should check TESTRPC is running', () => {
    return store.dispatch(actions.checkTestRPC()).then(() => {
      expect(store.getActions()[0]).toEqual({type: NETWORK_SET_TEST_RPC})
    })
  })

  it('should check METAMASK is exists', () => {
    window.web3 = new Web3()
    store.dispatch(actions.checkMetaMask()).then(() => {
      expect(store.getActions()[0]).toEqual({type: NETWORK_SET_TEST_METAMASK})
    })
    window.web3 = undefined
  })

  it('should select network', () => {
    store.dispatch(actions.selectNetwork(1))
    expect(store.getActions()).toEqual([
      {type: NETWORK_SET_NETWORK, selectedNetworkId: 1}
    ])
  })

  it('should select provider and reset network', () => {
    store.dispatch(actions.selectProvider(providerMap.local.id))
    expect(store.getActions()).toEqual([
      {type: NETWORK_SET_NETWORK, networkId: null},
      {type: NETWORK_SET_PROVIDER, selectedProviderId: providerMap.local.id}
    ])
    expect(ls(localStorageKeys.WEB3_PROVIDER)).toEqual(providerMap.local.id)
  })

  it('should add error message', () => {
    store.dispatch(actions.addError('bug'))
    expect(store.getActions()).toEqual([
      {type: NETWORK_ADD_ERROR, error: 'bug'}
    ])
  })

  it('should clear errors', () => {
    store.dispatch(actions.clearErrors())
    expect(store.getActions()).toEqual([
      {type: NETWORK_CLEAR_ERRORS}
    ])
  })

  it('should select account', () => {
    store.dispatch(actions.selectAccount(123))
    expect(store.getActions()).toEqual([
      {type: NETWORK_SELECT_ACCOUNT, selectedAccount: 123}
    ])
  })

  it('should load accounts', () => {
    return store.dispatch(actions.loadAccounts()).then(() => {
      expect(store.getActions()).toEqual([
        {type: NETWORK_SET_ACCOUNTS, accounts: []},
        {type: NETWORK_SET_ACCOUNTS, accounts}
      ])
    })
  })
})
