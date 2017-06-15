import LS from '../../src/utils/LocalStorage'
import { accounts } from '../init'
import { LOCAL_ID } from '../../src/network/settings'

describe('LocalStorage', () => {
  beforeEach(() => {
    // override common session
    LS.destroySession()
  })

  it('should create session', () => {
    expect(LS.isSession()).toEqual(false)
    LS.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    expect(LS.isSession()).toEqual(true)
    expect(LS.getLocalAccount()).toEqual(accounts[0])
  })

  it('should prevent to create double session', () => {
    expect(LS.isSession()).toEqual(false)
    LS.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    const token1 = LS.getToken()
    LS.createSession(accounts[1], LOCAL_ID, LOCAL_ID)
    const token2 = LS.getToken()
    expect(token1).toEqual(token2)
  })

  it('should destroy session', () => {
    expect(LS.isSession()).toEqual(false)
    LS.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    expect(LS.isSession()).toEqual(true)
    LS.destroySession()
    expect(LS.isSession()).toEqual(false)
    expect(LS.getLocalAccount()).toBeUndefined()
    expect(LS.getToken()).toBeNull()
    expect(LS.getAccount()).toBeUndefined()
    expect(LS.getNotices()).toEqual([])
  })

  it('should return local account for local session', () => {
    LS.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    expect(LS.getLocalAccount()).toEqual(accounts[0])
  })

  it('should not return local account for non-local session', () => {
    LS.createSession(accounts[0], 555, 555)
    expect(LS.getLocalAccount()).toBeUndefined()
  })

  it('should return locale without session', () => {
    LS.setLocale('en')
    expect(LS.getLocale()).toEqual('en')
  })

  it('should return lastURL', () => {
    LS.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    LS.setLastURL('last-page')
    expect(LS.getLastURL()).toEqual('last-page')
  })

  it('should return notices', () => {
    LS.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    const notices = [1, 2, 3]
    LS.setNotices(notices)
    expect(LS.getNotices()).toEqual(notices)
  })

  it('should return fromBlock', () => {
    LS.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    LS.setWatchFromBlock('key', 123)
    expect(LS.getWatchFromBlock('key')).toEqual(123)
  })
})
