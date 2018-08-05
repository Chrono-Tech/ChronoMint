/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import { LOCAL_ID } from '@chronobank/login/network/settings'
import networkService from '@chronobank/login/network/NetworkService'
import ls from '@chronobank/core-dependencies/utils/LocalStorage'
import { accounts, mockStore } from 'specsInit'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import VotingCollection from '../../models/voting/VotingCollection'
import { DUCK_VOTING } from '../voting/constants'
import { DUCK_TOKENS } from '../tokens/constants'
import TokensCollection from '../../models/tokens/TokensCollection'
import ProfileModel from '../../models/ProfileModel'
import MainWalletModel from '../../models/wallet/MainWalletModel'
import * as a from './actions'

let store

const profile = new ProfileModel({ name: 'profile1' })
const mainWallet = new MainWalletModel()
// TODO let userProfile: ProfileModel

const MOCK_LAST_URL = '/test-last-url'

const duckTokens = new TokensCollection()
const duckVoting = new VotingCollection()

const emptySessionMock = new Immutable.Map({
  market: {
    rates: {},
    lastMarket: {},
  },
  mainWallet,
  [ DUCK_TOKENS ]: duckTokens.isInited(true),
  [ DUCK_VOTING ]: duckVoting.isInited(true),
})

const cbeSessionMock = new Immutable.Map({
  market: {
    rates: {},
    lastMarket: {},
    tokens: [],
    currencies: [],
    profile,
  },
  session: {
    isSession: true,
    account: accounts[ 0 ],
    profile,
  },
  mainWallet,
  [ DUCK_TOKENS ]: duckTokens.isInited(true),
  [ DUCK_VOTING ]: duckVoting.isInited(true),
})

const userSessionMock = new Immutable.Map({
  market: {
    rates: {},
    lastMarket: {},
    tokens: [],
    currencies: [],
  },
  session: {
    isSession: true,
    account: accounts[ 5 ],
  },
  mainWallet,
  [ DUCK_TOKENS ]: duckTokens.isInited(true),
  [ DUCK_VOTING ]: duckVoting.isInited(true),
  [ DUCK_NETWORK ]: {
    selectedNetworkId: LOCAL_ID,
  },
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
