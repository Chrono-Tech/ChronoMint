import { accounts } from 'specsInit'
import { LOCAL_ID, LOCAL_PROVIDER_ID } from '@chronobank/login/network/settings'
import ls from './LocalStorage'

describe('LocalStorage', () => {
  beforeEach(() => {
    // override common session
    ls.destroySession()
  })

  it('should create session', () => {
    expect(ls.isSession()).toEqual(false)
    ls.createSession(accounts[0], LOCAL_PROVIDER_ID, LOCAL_ID)
    expect(ls.isSession()).toEqual(true)
    expect(ls.getLocalAccount()).toEqual(accounts[0])
  })

  it('should prevent to create double session', () => {
    expect(ls.isSession()).toEqual(false)
    ls.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    const token1 = ls.getToken()
    ls.createSession(accounts[1], LOCAL_ID, LOCAL_ID)
    const token2 = ls.getToken()
    expect(token1).toEqual(token2)
  })

  it('should destroy session', () => {
    expect(ls.isSession()).toEqual(false)
    ls.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    expect(ls.isSession()).toEqual(true)
    ls.destroySession()
    expect(ls.isSession()).toEqual(false)
    expect(ls.getLocalAccount()).toBeUndefined()
    expect(ls.getToken()).toBeNull()
    expect(ls.getAccount()).toBeUndefined()
  })

  it('should return local account for local session', () => {
    ls.createSession(accounts[0], LOCAL_PROVIDER_ID, LOCAL_ID)
    expect(ls.getLocalAccount()).toEqual(accounts[0])
  })

  it('should not return local account for non-local session', () => {
    ls.createSession(accounts[0], 555, 555)
    expect(ls.getLocalAccount()).toBeUndefined()
  })

  it('should return locale without session', () => {
    ls.setLocale('en')
    expect(ls.getLocale()).toEqual('en')
  })

  it('should return lastURL', () => {
    ls.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    ls.setLastURL('last-page')
    expect(ls.getLastURL()).toEqual('last-page')
  })
})
