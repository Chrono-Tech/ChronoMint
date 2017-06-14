import { accounts, mockStore } from '../../init'
import * as a from '../../../src/redux/session/actions'
import * as network from '../../../src/redux/network/actions'
import ProfileModel from '../../../src/models/ProfileModel'
import { WATCHER, WATCHER_CBE } from '../../../src/redux/watcher'
import LS from '../../../src/utils/LocalStorage'
import { Map } from 'immutable'

const profile = new ProfileModel({name: 'profile1'})

const REPLACE_METHOD = 'replace'
const MOCK_LAST_URL = '/test-last-url'
const LOGIN_URL = '/login'

const routerAction = (route, method = 'push') => ({
  type: '@@router/CALL_HISTORY_METHOD',
  payload: {args: [route], method}
})

let store

describe('settings cbe actions', () => {
  beforeEach(() => {
    store = mockStore(() => new Map({
      network: {
        accounts
      }
    }))
  })

  it('should not login nonexistent user', async () => {
    await store.dispatch(a.login('0x000926240b3d4f74b2765b29e76377a3968db733'))
    expect(store.getActions()).toEqual([
      routerAction(LOGIN_URL, REPLACE_METHOD)
    ])
  })

  it('should update profile', async () => {
    LS.createSession(accounts[0])
    await store.dispatch(a.updateUserProfile(profile))
    expect(store.getActions()).toEqual([
      {type: a.SESSION_PROFILE_FETCH},
      {type: a.SESSION_PROFILE, profile}
    ])
    LS.destroySession()
  })

  it('should login CBE and start watcher & cbeWatcher and go to last url', async () => {
    // prepare session
    LS.createSession(accounts[0])
    LS.setLastURL(MOCK_LAST_URL)
    // do not close session cause clear LS in memory
    // LS.destroySession()

    await store.dispatch(a.login(accounts[0]))

    const actions = store.getActions()
    expect(actions).toContainEqual({type: a.SESSION_CREATE_FETCH})
    expect(actions).toContainEqual({type: a.SESSION_CREATE, account: accounts[0], isCBE: true})
    expect(actions).toContainEqual({type: WATCHER})
    expect(actions).toContainEqual({type: WATCHER_CBE})
    expect(actions).toContainEqual(routerAction(MOCK_LAST_URL, REPLACE_METHOD))
    LS.destroySession()
  })

  it('should login CBE and go to default page (/cbe)', async () => {
    await store.dispatch(a.login(accounts[0]))
    const actions = store.getActions()
    expect(actions).toContainEqual({type: a.SESSION_CREATE, account: accounts[0], isCBE: true})
    expect(actions).toContainEqual(routerAction(a.DEFAULT_CBE_URL, REPLACE_METHOD))
    LS.destroySession()
  })

  it('should login USER and go to default url (/profile)', async () => {
    await store.dispatch(a.login(accounts[5]))
    const actions = store.getActions()

    expect(actions).toContainEqual({type: a.SESSION_CREATE, account: accounts[5], isCBE: false})
    expect(actions).toContainEqual({type: WATCHER})
    expect(actions).not.toContainEqual({type: WATCHER_CBE})
    expect(actions).toContainEqual(routerAction(a.DEFAULT_USER_URL, REPLACE_METHOD))
  })

  it.skip('should logout', () => {
    return store.dispatch(a.logout()).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_DESTROY, lastURL: 'blank'},
        routerAction('/login'),
        {type: network.NETWORK_SET_NETWORK, networkId: null},
        {type: network.NETWORK_SET_PROVIDER, selectedProviderId: null},
        {type: network.NETWORK_SET_ACCOUNTS, accounts: []},
        {type: network.NETWORK_SELECT_ACCOUNT, selectedAccount: null}
      ])
    })
  })
})
