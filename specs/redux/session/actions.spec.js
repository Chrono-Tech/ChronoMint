import {store} from '../../init'
import * as a from '../../../src/redux/session/actions'
import UserDAO from '../../../src/dao/UserDAO'
import UserModel from '../../../src/models/UserModel'
import {CBE_WATCHER_START} from '../../../src/redux/watcher'

const accounts = UserDAO.getAccounts()
const profile = new UserModel({name: Math.random()})
const profile2 = new UserModel({name: Math.random()})
const routerAction = (route, method = 'push') => ({
  type: '@@router/CALL_HISTORY_METHOD',
  payload: {args: [route], method}
})

describe('settings cbe actions', () => {
  it('should not login nonexistent user', () => {
    return store.dispatch(a.login('0x000926240b3d4f74b2765b29e76377a3968db733')).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        routerAction('/login')
      ])
    })
  })

  it('should update CBE profile, load it and go to home dashboard page', () => {
    return store.dispatch(a.updateUserProfile(profile, accounts[0])).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_PROFILE, profile},
        routerAction('/')
      ])
    })
  })

  it('should process initial login CBE', () => {
    const lastUrl = '/settings'
    window.localStorage.setItem(
      'lastUrls',
      JSON.stringify({
        [accounts[0]]: lastUrl
      })
    )
    return store.dispatch(a.login(accounts[0], true)).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        {type: a.SESSION_PROFILE, profile},
        {type: a.SESSION_CREATE, account: accounts[0], isCBE: true},
        routerAction(lastUrl, 'replace')
      ])
    })
  })

  it('should login CBE and start cbeWatcher', () => {
    return store.dispatch(a.login(accounts[0])).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        {type: a.SESSION_PROFILE, profile},
        {type: a.SESSION_CREATE, account: accounts[0], isCBE: true},
        {type: CBE_WATCHER_START}
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
    return store.dispatch(a.updateUserProfile(profile2, accounts[5])).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_PROFILE, profile: profile2},
        routerAction('/')
      ])
    })
  })

  it('should login non-CBE without redirection', () => {
    return store.dispatch(a.login(accounts[5])).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        {type: a.SESSION_PROFILE, profile: profile2},
        {type: a.SESSION_CREATE, account: accounts[5], isCBE: false}
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
        routerAction('/', 'replace')
      ])
    })
  })

  it('should login non-CBE with empty profile and go to profile page', () => {
    return store.dispatch(a.login(accounts[6])).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_CREATE_FETCH},
        {type: a.SESSION_PROFILE, profile: new UserModel()},
        {type: a.SESSION_CREATE, account: accounts[6], isCBE: false},
        routerAction('/profile')
      ])
    })
  })

  it('should logout', () => {
    return store.dispatch(a.logout()).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.SESSION_DESTROY, lastUrl: 'blank'},
        routerAction('/login')
      ])
    })
  })

  it('should create an action to destroy session', () => {
    expect(a.destroySession('test')).toEqual({type: a.SESSION_DESTROY, lastUrl: 'test'})
  })
})
