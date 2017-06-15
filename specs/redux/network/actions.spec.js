import * as a from '../../../src/redux/network/actions'
import * as session from '../../../src/redux/session/actions'
import { store, accounts, mockStore } from '../../init'
import Web3 from 'web3'
import { LOCAL_ID, providerMap } from '../../../src/network/settings'
import web3Provider from '../../../src/network/Web3Provider'
import LS from '../../../src/utils/LocalStorage'
import ContractsManagerDAO from '../../../src/dao/ContractsManagerDAO'
import AbstractContractDAO from '../../../src/dao/AbstractContractDAO'
import { Map } from 'immutable'

const LOCAL_HOST = 'http://localhost:8545'
const WRONG_LOCAL_HOST = 'http://localhost:9999'

describe('network actions', () => {
  beforeEach(() => {
    // override common session
    LS.destroySession()
  })
  it('should check TESTRPC is running', () => {
    return store.dispatch(a.checkTestRPC(LOCAL_HOST)).then(() => {
      expect(store.getActions()[0]).toEqual({type: a.NETWORK_SET_TEST_RPC})
    })
  })

  it('should check TESTRPC is not running', () => {
    return store.dispatch(a.checkTestRPC(WRONG_LOCAL_HOST)).then(() => {
      expect(store.getActions()[0]).toBeUndefined()
    })
  })

  it('should check METAMASK is exists', () => {
    window.web3 = new Web3()
    store.dispatch(a.checkMetaMask()).then(() => {
      expect(store.getActions()[0]).toEqual({type: a.NETWORK_SET_TEST_METAMASK})
    })
    window.web3 = undefined
  })

  it('should select network', () => {
    store.dispatch(a.selectNetwork(1))
    expect(store.getActions()).toEqual([
      {type: a.NETWORK_SET_NETWORK, selectedNetworkId: 1}
    ])
  })

  it('should select provider and reset network', () => {
    store.dispatch(a.selectProvider(providerMap.local.id))
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
    store.dispatch(a.selectAccount(123))
    expect(store.getActions()).toEqual([
      {type: a.NETWORK_SELECT_ACCOUNT, selectedAccount: 123}
    ])
  })

  it('should load accounts', () => {
    return store.dispatch(a.loadAccounts()).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.NETWORK_SET_ACCOUNTS, accounts: []},
        {type: a.NETWORK_SET_ACCOUNTS, accounts}
      ])
    })
  })

  it('should check network is valid', async () => {
    const isValid = await store.dispatch(a.checkNetwork())
    expect(isValid).toEqual(true)
  })

  it('should check local session is valid', async () => {
    const isValid = await store.dispatch(a.checkLocalSession(accounts[0], LOCAL_HOST))
    expect(isValid).toEqual(true)
  })

  it('should check local session is not valid (without account)', async () => {
    expect(await store.dispatch(a.checkLocalSession())).toEqual(false)
  })

  it('should check local session is not valid (wrong account)', async () => {
    expect(await store.dispatch(a.checkLocalSession('0x123'))).toEqual(false)
  })

  it('should check local session is not valid (wrong url)', async () => {
    expect(await store.dispatch(a.checkLocalSession(accounts[0], WRONG_LOCAL_HOST))).toEqual(false)
  })

  it('should restore local storage', async () => {
    // setup web3
    const account = accounts[0]
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(new web3.providers.HttpProvider(LOCAL_HOST))

    await store.dispatch(a.restoreLocalSession(account))
    const actions = store.getActions()

    // skipped reset action
    expect(actions[1]).toEqual({type: a.NETWORK_SET_PROVIDER, selectedProviderId: LOCAL_ID})
    expect(actions[2]).toEqual({type: a.NETWORK_SET_NETWORK, selectedNetworkId: LOCAL_ID})
    // skipped reset action
    expect(actions[4]).toEqual({type: a.NETWORK_SET_ACCOUNTS, accounts})
    expect(actions[5]).toEqual({type: a.NETWORK_SELECT_ACCOUNT, selectedAccount: account})
  })

  it('should create network session', () => {
    const store = mockStore(new Map({
      network: {
        accounts
      }
    }))
    store.dispatch(a.createNetworkSession(accounts[0], LOCAL_ID, LOCAL_ID))
    expect(LS.isSession()).toEqual(true)
    expect(store.getActions()).toEqual([
      {type: session.SESSION_CREATE, account: accounts[0]}
    ])
  })

  it('should not create session', () => {
    let error = null
    try {
      store.dispatch(a.createNetworkSession())
    } catch (e) {
      error = e
    }
    expect(error).not.toBeNull()
    expect(LS.isSession()).toEqual(false)
  })

  it('should destroy session', async () => {
    // prepare
    const store = mockStore(new Map({
      network: {
        accounts
      }
    }))
    const dao = await ContractsManagerDAO.getUserManagerDAO()
    await dao.watchCBE(() => {})
    expect(AbstractContractDAO.getWatchedEvents()).not.toEqual([])
    store.dispatch(a.createNetworkSession(accounts[0], LOCAL_ID, LOCAL_ID))
    store.clearActions()

    // test
    store.dispatch(a.destroyNetworkSession(null, false))
    expect(LS.isSession()).toEqual(false)
    expect(store.getActions()).toEqual([
      {type: session.SESSION_DESTROY}
    ])
    expect(AbstractContractDAO.getWatchedEvents()).toEqual([])
  })

  it.skip('should login Uport', () => {
    // TODO @dkchv: update
  })
})
