import * as types from './actions'
import ProfileModel from '../../models/ProfileModel'

const initialState = {
  account: null,
  provider: null,
  network: null,
  isSession: false,
  profile: new ProfileModel(),
  isCBE: false,
  lastURL: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    // session
    case types.SESSION_CREATE:
      return {
        ...state,
        account: action.account,
        provider: action.provider,
        network: action.network,
        isSession: true,
        lastURL: action.lastURL,
      }
    case types.SESSION_DESTROY: {
      return {
        ...initialState,
        lastURL: action.lastURL,
      }
    }
    // profile CRUD
    case types.SESSION_PROFILE:
      return {
        ...state,
        profile: action.profile,
        isCBE: action.isCBE,
      }
    case types.SESSION_PROFILE_UPDATE:
      return {
        ...state,
        profile: action.profile,
      }
    default:
      return state
  }
}
