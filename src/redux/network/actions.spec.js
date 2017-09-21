import Immutable from 'immutable'
import Web3 from 'web3'
import AbstractContractDAO from 'dao/AbstractContractDAO'
import web3Provider from 'network/Web3Provider'
import ls from 'utils/LocalStorage'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { store, accounts, mockStore } from 'specsInit'
import * as a from './actions'
import NetworkService from './actions'

import * as session from '../session/actions'
import { LOCAL_ID, providerMap } from 'network/settings'

const LOCAL_HOST = 'http://localhost:8545'
const WRONG_LOCAL_HOST = 'http://localhost:9999'

describe('network actions', () => {
  beforeEach(() => {
    // override common session
    ls.destroySession()
  })
  it('should check TESTRPC is running', () => {
    return NetworkService.checkTestRPC(LOCAL_HOST).then(() => {
      expect(store.getActions()[0]).toEqual({type: a.NETWORK_SET_TEST_RPC})
    })
  })

  it('should check TESTRPC is not running', () => {
    return NetworkService.checkTestRPC(WRONG_LOCAL_HOST).then(() => {
      expect(store.getActions()[0]).toBeUndefined()
    })
  })

  it('should check METAMASK is exists', async () => {
    window.web3 = new Web3()
    const result = await NetworkService.checkMetaMask()
    expect(result).toEqual(true)
    expect(store.getActions()).toEqual([{type: a.NETWORK_SET_TEST_METAMASK}])
    window.web3 = undefined
  })

  it('should select network', () => {
    NetworkService.selectNetwork(1)
    expect(store.getActions()).toEqual([
      {type: a.NETWORK_SET_NETWORK, selectedNetworkId: 1}
    ])
  })

  it('should select provider and reset network', () => {
    NetworkService.selectProvider(providerMap.local.id)
    expect(store.getActions()).toEqual([
      {type: a.NETWORK_SET_NETWORK, networkId: null},
      {type: a.NETWORK_SET_PROVIDER, selectedProviderId: providerMap.local.id}
    ])
  })

  it('should add error message', () => {
    store.dispatch(a.addError('bug'))
    expect(store.getActions()).toEqual([
      {type: a.NETWORK_ADD_ERROR, error: 'bug'}
    ])
  })

  it('should clear errors', () => {
    store.dispatch(a.clearErrors())
    expect(store.getActions()).toEqual([
      {type: a.NETWORK_CLEAR_ERRORS}
    ])
  })

  it('should select account', () => {
    NetworkService.selectAccount(123)
    expect(store.getActions()).toEqual([
      {type: a.NETWORK_SELECT_ACCOUNT, selectedAccount: 123}
    ])
  })

  it('should load accounts', () => {
    return store.dispatch(a.loadAccounts()).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.NETWORK_LOADING, isLoading: true},
        {type: a.NETWORK_SET_ACCOUNTS, accounts: []},
        {type: a.NETWORK_SET_ACCOUNTS, accounts},
        {type: a.NETWORK_LOADING, isLoading: false}
      ])
    })
  })

  it('should check network is valid', async () => {
    const isValid = await NetworkService.checkNetwork()
    expect(isValid).toEqual(true)
  })

  it('should check local session is valid', async () => {
    const isValid = await NetworkService.checkLocalSession(accounts[0], LOCAL_HOST)
    expect(isValid).toEqual(true)
  })

  it('should check local session is not valid (without account)', async () => {
    expect(await NetworkService.checkLocalSession()).toEqual(false)
  })

  it('should check local session is not valid (wrong account)', async () => {
    expect(await NetworkService.checkLocalSession('0x123')).toEqual(false)
  })

  it('should check local session is not valid (wrong url)', async () => {
    expect(await NetworkService.checkLocalSession(accounts[0], WRONG_LOCAL_HOST)).toEqual(false)
  })

  it('should restore local session', async () => {
    // setup web3
    const account = accounts[0]
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(new web3.providers.HttpProvider(LOCAL_HOST))

    await NetworkService.restoreLocalSession(account)
    const actions = store.getActions()

    expect(actions).toContainEqual({type: a.NETWORK_SET_NETWORK, selectedNetworkId: LOCAL_ID})
    expect(actions).toContainEqual({type: a.NETWORK_SET_PROVIDER, selectedProviderId: LOCAL_ID})
    expect(actions).toContainEqual({type: a.NETWORK_SET_ACCOUNTS, accounts})
    expect(actions).toContainEqual({type: a.NETWORK_SELECT_ACCOUNT, selectedAccount: account})
  })

  it('should create network session', () => {
    const store = mockStore(new Immutable.Map({
      network: {
        accounts
      }
    }))
    NetworkService.createNetworkSession(accounts[0], LOCAL_ID, LOCAL_ID)
    expect(ls.isSession()).toEqual(true)
    expect(store.getActions()).toEqual([
      {type: session.SESSION_CREATE, account: accounts[0]}
    ])
  })

  it('should not create session', () => {
    let error = null
    try {
      NetworkService.createNetworkSession()
    } catch (e) {
      error = e
    }
    expect(error).not.toBeNull()
    expect(ls.isSession()).toEqual(false)
  })

  it('should destroy session', async () => {
    // prepare
    const store = mockStore(new Immutable.Map({
      network: {
        accounts
      }
    }))
    const dao = await contractsManagerDAO.getUserManagerDAO()
    await dao.watchCBE(() => {
    })
    expect(AbstractContractDAO.getWholeWatchedEvents()).not.toEqual([])
    NetworkService.createNetworkSession(accounts[0], LOCAL_ID, LOCAL_ID)
    store.clearActions()

    // test
    await NetworkService.destroyNetworkSession(null, false)
    expect(ls.isSession()).toEqual(false)
    expect(store.getActions()).toEqual([
      {type: session.SESSION_DESTROY}
    ])
    expect(AbstractContractDAO.getWholeWatchedEvents()).toEqual([])
  })

  it.skip('should login Uport', () => {
    // TODO @dkchv: update
  })
})
