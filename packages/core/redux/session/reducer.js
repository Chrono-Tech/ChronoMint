/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import * as types from './constants'
import ProfileModel from '../../models/ProfileModel'

const initialState = {
  account: null,
  isSession: false,
  profile: new ProfileModel(),
  isCBE: false,
  gasPriceMultiplier: new Immutable.Map(),
  profileSignature: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    // session
    case types.SESSION_CREATE:
      return {
        ...state,
        account: action.account,
        isSession: true,
      }
    case types.SESSION_DESTROY: {
      return initialState
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
    case types.GAS_SLIDER_MULTIPLIER_CHANGE:
      return {
        ...state,
        gasPriceMultiplier: state.gasPriceMultiplier.set(action.id, action.value),
      }
    case types.SET_PROFILE_SIGNATURE:
      return {
        ...state,
        profileSignature: action.signature,
      }
    default:
      return state
  }
}
