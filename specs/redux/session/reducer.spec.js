import reducer from '../../../src/redux/session/reducer'
import * as a from '../../../src/redux/session/actions'
import AbstractContractDAO from '../../../src/dao/AbstractContractDAO'
import UserDAO from '../../../src/dao/UserDAO'
import UserModel from '../../../src/models/UserModel'

const accounts = UserDAO.getAccounts()
const initialState = {
  account: null,
  isCBE: false,
  isFetching: false,
  profile: new UserModel(),
  profileFetching: false
}
const profile = new UserModel({name: Math.random()})

describe('settings cbe reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState)
  })

  it('should handle SESSION_CREATE_FETCH', () => {
    expect(
      reducer([], {type: a.SESSION_CREATE_FETCH})
    ).toEqual({
      isFetching: true
    })
  })

  it('should handle SESSION_CREATE', () => {
    expect(
      reducer([], {type: a.SESSION_CREATE, account: accounts[0], isCBE: true})
    ).toEqual({
      account: accounts[0],
      isCBE: true,
      isFetching: false
    })
    expect(window.localStorage.getItem('account')).toEqual(accounts[0])
  })

  it('should handle SESSION_PROFILE_FETCH', () => {
    expect(
      reducer([], {type: a.SESSION_PROFILE_FETCH})
    ).toEqual({
      profileFetching: true
    })
  })

  it('should handle SESSION_PROFILE', () => {
    expect(
      reducer([], {type: a.SESSION_PROFILE, profile})
    ).toEqual({
      profile,
      profileFetching: false
    })
  })

  it('should handle SESSION_DESTROY', () => {
    /** prepare */
    window.localStorage.setItem('account', accounts[0])
    return UserDAO.watchCBE(() => {
    }, accounts[0]).then(() => {
      expect(AbstractContractDAO.getWatchedEvents()).not.toEqual([])

      /** test */
      expect(
        reducer([], {type: a.SESSION_DESTROY, lastUrl: 'test'})
      ).toEqual(initialState)

      expect(AbstractContractDAO.getWatchedEvents()).toEqual([])

      expect(window.localStorage.length()).toEqual(1)
      expect(JSON.parse(window.localStorage.getItem('lastUrls'))).toEqual({[accounts[0]]: 'test'})
    })
  })
})
