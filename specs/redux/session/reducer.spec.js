import reducer from '../../../src/redux/session/reducer'
import * as a from '../../../src/redux/session/actions'
import AbstractContractDAO from '../../../src/dao/AbstractContractDAO'
import UserManagerDAO from '../../../src/dao/UserManagerDAO'
import UserModel from '../../../src/models/UserModel'
import LS from '../../../src/dao/LocalStorageDAO'
import web3Provider from '../../../src/network/Web3Provider'

let accounts, profile
const initialState = {
  account: null,
  isCBE: false,
  isFetching: false,
  profile: new UserModel(),
  profileFetching: false
}

describe('settings cbe reducer', () => {
  beforeAll(done => {
    web3Provider.getWeb3().then(web3 => {
      accounts = web3.eth.accounts
      profile = new UserModel({name: Math.random()})
      done()
    })
  })

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
    return UserManagerDAO.watchCBE(() => {
    }, accounts[0]).then(() => {
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
