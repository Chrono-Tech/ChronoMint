import Immutable from 'immutable'
import { LOCAL_ID } from 'Login/network/settings'
import networkService from 'Login/redux/network/actions'
import ProfileModel from 'models/ProfileModel'
import MainWalletModel from 'models/Wallet/MainWalletModel'
import { MARKET_INIT } from 'redux/market/action'
import { WATCHER, WATCHER_CBE } from 'redux/watcher/actions'
import { accounts, mockStore } from 'specsInit'
import ls from 'utils/LocalStorage'
import * as a from './actions'

let store

const profile = new ProfileModel({ name: 'profile1' })
const mainWallet = new MainWalletModel()
// TODO let userProfile: ProfileModel

const REPLACE_METHOD = 'replace'
const MOCK_LAST_URL = '/test-last-url'

const routerAction = (route, method = 'push') => ({
  type: '@@router/CALL_HISTORY_METHOD',
  payload: { args: [ route ], method },
})

const emptySessionMock = new Immutable.Map({
  market: {
    rates: {},
    lastMarket: {},
  },
  mainWallet,
})

const cbeSessionMock = new Immutable.Map({
  market: {
    rates: {},
    lastMarket: {},
    tokens:[],
    currencies: [],
    profile,
  },
  session: {
    isSession: true,
    account: accounts[ 0 ],
    profile,
  },
  mainWallet,
})

const userSessionMock = new Immutable.Map({
  market: {
    rates: {},
    lastMarket: {},
    tokens:[],
    currencies: [],
  },
  session: {
    isSession: true,
    account: accounts[ 5 ],
  },
  mainWallet,
})

describe('session actions', () => {
  beforeEach(() => {
    // override common cbe session
    ls.destroySession()
  })

  it('should create session', () => {
    store = mockStore(emptySessionMock)
    a.createSession({ account: accounts[ 0 ], dispatch: store.dispatch })
    expect(store.getActions()).toMatchSnapshot()
  })

  it('should destroy session', () => {
    store = mockStore(emptySessionMock)
    a.destroySession({ dispatch: store.dispatch })
    expect(store.getActions()).toMatchSnapshot()
  })

  it('should not login without session', async () => {
    store = mockStore(emptySessionMock)
    let error = null
    try {
      await store.dispatch(a.login(accounts[ 0 ]))
    } catch (e) {
      error = e
    }
    expect(error).not.toBeNull()
  })

  it('should not update profile without session', async () => {
    store = mockStore(emptySessionMock)
    let error = null
    try {
      await store.dispatch(a.updateUserProfile(accounts[ 0 ]))
    } catch (e) {
      error = e
    }
    expect(error).not.toBeNull()
  })

  it.skip('should update profile', async () => {
    const store = mockStore(cbeSessionMock)
    ls.createSession(accounts[ 1 ], LOCAL_ID, LOCAL_ID)
    await store.dispatch(a.updateUserProfile(profile))

    expect(store.getActions()).toMatchSnapshot()
  })

  it('should login CBE and start watcher with cbeWatcher and go to last url', async () => {
    store = mockStore(cbeSessionMock)
    ls.createSession(accounts[ 0 ], LOCAL_ID, LOCAL_ID)
    ls.setLastURL(MOCK_LAST_URL)
    store.clearActions()
    await store.dispatch(a.login(accounts[ 0 ]))

    expect(store.getActions()).toMatchSnapshot()
  })

  it('should login CBE and go to default page (/cbe)', async () => {
    store = mockStore(cbeSessionMock)
    ls.createSession(accounts[ 0 ], LOCAL_ID, LOCAL_ID)
    store.clearActions()

    await store.dispatch(a.login(accounts[ 0 ]))

    expect(store.getActions()).toMatchSnapshot()
  })

  it('should login USER and go to default url (/wallet)', async () => {
    store = mockStore(userSessionMock)
    ls.createSession(accounts[ 5 ], LOCAL_ID, LOCAL_ID)
    store.clearActions()

    await store.dispatch(a.login(accounts[ 5 ]))

    expect(store.getActions()).toMatchSnapshot()
  })

  it('should logout', async () => {
    store = mockStore(userSessionMock)
    ls.createSession(accounts[ 5 ], LOCAL_ID, LOCAL_ID)
    store.clearActions()

    const handler = jest.fn()
    networkService.on('destroySession', handler)

    await store.dispatch(a.logout())

    expect(handler).toHaveBeenCalled()
    expect(store.getActions()).toMatchSnapshot()
  })
})
