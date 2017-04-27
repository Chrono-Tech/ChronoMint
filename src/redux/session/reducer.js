import * as a from './actions'
import AbstractContractDAO from '../../dao/AbstractContractDAO'
import UserModel from '../../models/UserModel'
import LS from '../../dao/LocalStorageDAO'

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
      LS.setAccount(account)
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
      const account = LS.getAccount()
      const lastUrlsFromLS = LS.getLastUrls() || {}
      const lastUrls = {
        ...lastUrlsFromLS,
        [account]: action.lastUrl
      }
      LS.clear()
      LS.setLastUrls(lastUrls)
      AbstractContractDAO.stopWatching()
      return initialState
    }
    default:
      return state
  }
}
