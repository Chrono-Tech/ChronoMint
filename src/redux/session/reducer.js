import * as a from './actions'
import AbstractContractDAO from '../../dao/AbstractContractDAO'
import UserModel from '../../models/UserModel'
import localStorageKeys from '../../constants/localStorageKeys'
import ls from '../../utils/localStorage'

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
      ls(localStorageKeys.ACCOUNT, account)
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
      const account = ls(localStorageKeys.ACCOUNT)
      const lastUrlsFromLS = ls(localStorageKeys.LAST_URLS) || {}
      const lastUrls = {
        ...lastUrlsFromLS,
        [account]: action.lastUrl
      }
      ls.clear()
      ls(localStorageKeys.LAST_URLS, lastUrls)
      AbstractContractDAO.stopWatching()
      return initialState
    }
    default:
      return state
  }
}
