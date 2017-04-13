import * as a from './actions'
import AbstractContractDAO from '../../dao/AbstractContractDAO'
import UserModel from '../../models/UserModel'

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
      window.localStorage.setItem('chronoBankAccount', account)
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
      const chronoBankAccount = window.localStorage.getItem('chronoBankAccount')
      const lastUrls = {
        ...JSON.parse(window.localStorage.getItem('lastUrls') || '{}'),
        [chronoBankAccount]: action.lastUrl
      }
      window.localStorage.clear()
      window.localStorage.setItem('lastUrls', JSON.stringify(lastUrls))
      AbstractContractDAO.stopWatching()
      return initialState
    }
    default:
      return state
  }
}
