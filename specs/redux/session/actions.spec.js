import { accounts, mockStore } from '../../init'
import * as a from '../../../src/redux/session/actions'
import * as network from '../../../src/redux/network/actions'
import ProfileModel from '../../../src/models/ProfileModel'
import { WATCHER, WATCHER_CBE } from '../../../src/redux/watcher'
import LS from '../../../src/utils/LocalStorage'
import { Map } from 'immutable'

const profile = new ProfileModel({name: Math.random()})
const profile2 = new ProfileModel({name: Math.random()})
const routerAction = (route, method = 'push') => ({
  type: '@@router/CALL_HISTORY_METHOD',
  payload: {args: [route], method}
})
const updateUserProfileActions = (profile) => {
  return [
    {type: a.SESSION_PROFILE_FETCH},
    routerAction('/'),
    {type: a.SESSION_PROFILE, profile}
  ]
}

let store

describe('settings cbe actions', () => {
  beforeEach(() => {
    store = mockStore(() => new Map({
      network: {
        accounts
      }
    }))
  })

  it('should not login nonexistent user', () => {
    return store.dispatch(a.login('0x000926240b3d4f74b2765b29e76377a3968db733')).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        routerAction('/login')
      ])
    })
  })

  it('should update CBE profile, load it and go to home dashboard page', () => {
    return store.dispatch(a.updateUserProfile(profile)).then(() => {
      expect(store.getActions()).toEqual(updateUserProfileActions(profile))
    })
  })

  it('should process initial login CBE', () => {
    const lastUrl = '/settings'
    LS.setLastUrls({[accounts[0]]: lastUrl})
    return store.dispatch(a.login(accounts[0], true)).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        {type: a.SESSION_PROFILE, profile},
        {type: a.SESSION_CREATE, account: accounts[0], isCBE: true},
        routerAction(lastUrl, 'replace')
      ])
    })
  })

  it('should login CBE and start watcher & cbeWatcher', () => {
    return store.dispatch(a.login(accounts[0])).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        {type: a.SESSION_PROFILE, profile},
        {type: a.SESSION_CREATE, account: accounts[0], isCBE: true},
        {type: WATCHER},
        {type: WATCHER_CBE}
      ])
    })
  })

  it('should process initial login CBE and go to dashboard page', () => {
    return store.dispatch(a.login(accounts[0], true)).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        {type: a.SESSION_PROFILE, profile},
        {type: a.SESSION_CREATE, account: accounts[0], isCBE: true},
        routerAction('/cbe', 'replace')
      ])
    })
  })

  it('should update non-CBE profile, load it and go to home wallet page', () => {
    LS.setAccount(accounts[5])
    return store.dispatch(a.updateUserProfile(profile2)).then(() => {
      expect(store.getActions()).toEqual(updateUserProfileActions(profile2))
    })
  })

  it('should login non-CBE without redirection', () => {
    return store.dispatch(a.login(accounts[5])).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        {type: a.SESSION_PROFILE, profile: profile2},
        {type: a.SESSION_CREATE, account: accounts[5], isCBE: false},
        {type: WATCHER}
      ])
    })
  })

  it('should process initial login non-CBE and go to home page', () => {
    return store.dispatch(a.login(accounts[5], true, true)).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        {type: a.SESSION_PROFILE, profile: profile2},
        {type: a.SESSION_CREATE, account: accounts[5], isCBE: false},
        routerAction('/', 'replace')
      ])
    })
  })

  it('should login non-CBE and go to home page', () => {
    return store.dispatch(a.login(accounts[5], false, true)).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        {type: a.SESSION_PROFILE, profile: profile2},
        {type: a.SESSION_CREATE, account: accounts[5], isCBE: false},
        {type: WATCHER},
        routerAction('/', 'replace')
      ])
    })
  })

  it('should login non-CBE with empty profile and go to profile page', () => {
    return store.dispatch(a.login(accounts[6])).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        {type: a.SESSION_PROFILE, profile: new ProfileModel()},
        {type: a.SESSION_CREATE, account: accounts[6], isCBE: false},
        {type: WATCHER},
        routerAction('/profile')
      ])
    })
  })

  it('should logout', () => {
    return store.dispatch(a.logout()).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_DESTROY, lastUrl: 'blank'},
        routerAction('/login'),
        {type: network.NETWORK_SET_NETWORK, networkId: null},
        {type: network.NETWORK_SET_PROVIDER, selectedProviderId: null},
        {type: network.NETWORK_SET_ACCOUNTS, accounts: []},
        {type: network.NETWORK_SELECT_ACCOUNT, selectedAccount: null}
      ])
    })
  })
})
