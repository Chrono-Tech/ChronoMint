import reducer from '../../../src/redux/session/reducer'
import * as a from '../../../src/redux/session/actions'
import { accounts } from '../../init'
import AbstractContractDAO from '../../../src/dao/AbstractContractDAO'
import UserDAO from '../../../src/dao/UserDAO'
import ProfileModel from '../../../src/models/ProfileModel'
import LS from '../../../src/dao/LocalStorageDAO'

const profile = new ProfileModel({name: Math.random()})
const initialState = {
  account: null,
  isCBE: false,
  isFetching: false,
  profile: new ProfileModel(),
  profileFetching: false
}

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
    expect(LS.getAccount()).toEqual(accounts[0])
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
    LS.setAccount(accounts[0])
    return UserDAO.watchCBE(() => {}, accounts[0]).then(() => {
      expect(AbstractContractDAO.getWatchedEvents()).not.toEqual([])

      /** test */
      expect(
        reducer([], {type: a.SESSION_DESTROY, lastUrl: 'test'})
      ).toEqual(initialState)

      expect(AbstractContractDAO.getWatchedEvents()).toEqual([])

      expect(LS.length()).toEqual(1)
      expect(LS.getLastUrls()).toEqual({[accounts[0]]: 'test'})
    })
  })
})
