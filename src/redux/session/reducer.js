import * as a from './actions'
import ProfileModel from '../../models/ProfileModel'

const initialState = {
  account: null,
  isSession: false,
  profile: new ProfileModel(),
  profileFetching: false,
  isCBE: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    // session
    case a.SESSION_CREATE:
      return {
        ...state,
        account: action.account,
        isSession: true
      }
    case a.SESSION_DESTROY: {
      return initialState
    }
    // profile CRUD
    case a.SESSION_PROFILE_FETCH:
      return {
        ...state,
        profileFetching: !state.profileFetching
      }
    case a.SESSION_PROFILE:
      return {
        ...state,
        profile: action.profile,
        isCBE: action.isCBE,
        profileFetching: false
      }
    case a.SESSION_PROFILE_UPDATE:
      return {
        ...state,
        profile: action.profile,
        profileFetching: false
      }
    default:
      return state
  }
}
