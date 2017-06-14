import * as a from './actions'
import AbstractContractDAO from '../../dao/AbstractContractDAO'
import ProfileModel from '../../models/ProfileModel'
import LS from '../../utils/LocalStorage'

const initialState = {
  account: null,
  isCBE: false,
  isFetching: false,
  profile: new ProfileModel(),
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
      LS.setLastURL(action.lastURL)
      LS.destroySession()
      AbstractContractDAO.stopWatching()
      return initialState
    }
    default:
      return state
  }
}
