import * as a from './actions'
import AbstractContractDAO from '../../dao/AbstractContractDAO'
import UserModel from '../../models/UserModel'
import localStorageKeys from '../../constants/localStorageKeys'

const initialState = {
  account: null,
  isCBE: false,
  isFetching: false,
  profile: new UserModel(),
  profileFetching: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.SESSION_CREATE_FETCH:
      return {
        ...state,
        isFetching: true
      }
    case a.SESSION_CREATE:
      const {account, isCBE} = action
      window.localStorage.setItem(localStorageKeys.CHRONOBANK_ACCOUNT, account)
      return {
        ...state,
        account,
        isCBE,
        isFetching: false
      }
    case a.SESSION_PROFILE_FETCH:
      return {
        ...state,
        profileFetching: true
      }
    case a.SESSION_PROFILE:
      return {
        ...state,
        profile: action.profile ? action.profile : state.profile,
        profileFetching: false
      }
    case a.SESSION_DESTROY: {
      const chronoBankAccount = window.localStorage.getItem(localStorageKeys.CHRONOBANK_ACCOUNT)
      const lastUrls = {
        ...JSON.parse(window.localStorage.getItem(localStorageKeys.LAST_URLS) || '{}'),
        [chronoBankAccount]: action.lastUrl
      }
      window.localStorage.clear()
      window.localStorage.setItem(localStorageKeys.LAST_URLS, JSON.stringify(lastUrls))
      AbstractContractDAO.stopWatching()
      return initialState
    }
    default:
      return state
  }
}
