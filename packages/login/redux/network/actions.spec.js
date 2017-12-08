import AbstractContractDAO from 'dao/AbstractContractDAO'
import Immutable from 'immutable'
import { createSession, destroySession } from 'redux/session/actions'
import { accounts, mockStore, store } from 'specsInit'
import Web3 from 'web3'
import metaMaskResolver from '../../network/metaMaskResolver'
import { LOCAL_ID, providerMap } from '../../network/settings'
import web3Provider from '../../network/Web3Provider'
import networkService from '../../network/NetworkService'
import { constants } from '../../settings'
import * as a from './actions'

const { SESSION_CREATE, SESSION_DESTROY } = constants
const LOCAL_HOST = 'http://localhost:8545'
const WRONG_LOCAL_HOST = 'http://localhost:9999'

describe('network actions', () => {
  beforeEach(() => {
    // override common session
  })
  it('should check TESTRPC is running', () => {
    networkService
      .connectStore(store)
    return networkService.checkTestRPC(LOCAL_HOST).then(() => {
      expect(store.getActions()[ 0 ]).toEqual({ type: a.NETWORK_SET_TEST_RPC })
    })
  })

  it('should check TESTRPC is not running', () => {
    return networkService.checkTestRPC(WRONG_LOCAL_HOST).then(() => {
      expect(store.getActions()[ 0 ]).toBeUndefined()
    })
  })

  it('should check METAMASK is exists', () => {
    window.web3 = new Web3()
    metaMaskResolver
      .on('resolve', (isMetaMask) => {
        try {
          if (isMetaMask) {
            store.dispatch({ type: a.NETWORK_SET_TEST_METAMASK })
          }
        } catch (e) {
          // eslint-disable-next-line
          console.error(e)
        }
      })
      .start()
    expect(store.getActions()).toEqual([ { type: a.NETWORK_SET_TEST_METAMASK } ])
    window.web3 = undefined
  })

  it('should select network', () => {
    networkService.selectNetwork(1)
    expect(store.getActions()).toEqual([
      { type: a.NETWORK_SET_NETWORK, selectedNetworkId: 1 },
    ])
  })

  it('should select provider and reset network', () => {
    networkService.selectProvider(providerMap.local.id)
    expect(store.getActions()).toEqual([
      { type: a.NETWORK_SET_NETWORK, networkId: null },
      { type: a.NETWORK_SET_PROVIDER, selectedProviderId: providerMap.local.id },
    ])
  })

  it('should add error message', () => {
    store.dispatch(a.addError('bug'))
    expect(store.getActions()).toEqual([
      { type: a.NETWORK_ADD_ERROR, error: 'bug' },
    ])
  })

  it('should clear errors', () => {
    store.dispatch(a.clearErrors())
    expect(store.getActions()).toEqual([
      { type: a.NETWORK_CLEAR_ERRORS },
    ])
  })

  it('should select account', () => {
    networkService.selectAccount(123)
    expect(store.getActions()).toEqual([
      { type: a.NETWORK_SELECT_ACCOUNT, selectedAccount: 123 },
    ])
  })

  it('should load accounts', () => {
    return networkService.loadAccounts()
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: a.NETWORK_LOADING, isLoading: true },
          { type: a.NETWORK_SET_ACCOUNTS, accounts: [] },
          { type: a.NETWORK_SET_ACCOUNTS, accounts },
          { type: a.NETWORK_LOADING, isLoading: false },
        ])
      })
  })

  it('should check network is valid', async () => {
    const isValid = await networkService.checkNetwork()
    expect(isValid).toEqual(true)
  })

  it('should check local session is valid', async () => {
    const isValid = await networkService.checkLocalSession(accounts[ 0 ], LOCAL_HOST)
    expect(isValid).toEqual(true)
  })

  it('should check local session is not valid (without account)', async () => {
    expect(await networkService.checkLocalSession()).toEqual(false)
  })

  it('should check local session is not valid (wrong account)', async () => {
    expect(await networkService.checkLocalSession('0x123')).toEqual(false)
  })

  it('should check local session is not valid (wrong url)', async () => {
    expect(await networkService.checkLocalSession(accounts[ 0 ], WRONG_LOCAL_HOST)).toEqual(false)
  })

  it('should restore local session', async () => {
    // setup web3
    const account = accounts[ 0 ]
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(new web3.providers.HttpProvider(LOCAL_HOST))

    await networkService.restoreLocalSession(account)
    const actions = store.getActions()

    expect(actions).toContainEqual({ type: a.NETWORK_SET_NETWORK, selectedNetworkId: LOCAL_ID })
    expect(actions).toContainEqual({ type: a.NETWORK_SET_PROVIDER, selectedProviderId: LOCAL_ID })
    expect(actions).toContainEqual({ type: a.NETWORK_SET_ACCOUNTS, accounts })
    expect(actions).toContainEqual({ type: a.NETWORK_SELECT_ACCOUNT, selectedAccount: account })
  })

  it('should create network session', () => {
    const store = mockStore(new Immutable.Map({
      network: {
        accounts,
      },
    }))
    createSession({
      account: accounts[ 0 ],
      provider: LOCAL_ID,
      network: LOCAL_ID,
      dispatch: store.dispatch,
    })
    expect(store.getActions()).toEqual([
      { type: SESSION_CREATE, account: accounts[ 0 ] },
    ])
  })

  it('should not create session', () => {
    let error = null
    try {
      createSession()
    } catch (e) {
      error = e
    }
    expect(error).not.toBeNull()
  })

  it('should destroy session', async () => {
    // prepare
    const store = mockStore(new Immutable.Map({
      network: {
        accounts,
      },
    }))
    createSession({
      account: accounts[ 0 ],
      provider: LOCAL_ID,
      network: LOCAL_ID,
      dispatch: store.dispatch,
    })
    store.clearActions()

    // test
    destroySession({ dispatch: store.dispatch })
    expect(store.getActions()).toEqual([
      { type: SESSION_DESTROY },
    ])
    expect(AbstractContractDAO.getWholeWatchedEvents()).toEqual([])
  })

  it.skip('should login Uport', () => {
    // TODO @dkchv: update
  })
})

