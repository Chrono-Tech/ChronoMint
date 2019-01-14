/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  GAS_SLIDER_MULTIPLIER_CHANGE,
  SESSION_CREATE,
  SESSION_DESTROY,
  SESSION_PROFILE,
  SET_PROFILE_SIGNATURE,
  SET_WEB3_INSTANCE,
  CLEAR_WEB3_INSTANCE,
} from './constants'

// TODO: to think about better place for this action
export const gasSliderMultiplierChange = (value, id) => ({
  type: GAS_SLIDER_MULTIPLIER_CHANGE,
  value,
  id,
})

export const sessionCreate = (account) => ({
  type: SESSION_CREATE,
  account,
})

export const sessionDestroy = () => ({
  type: SESSION_DESTROY,
})

export const sessionProfile = (profile, isCBE) => ({
  type: SESSION_PROFILE,
  profile,
  isCBE,
})

export const setProfileSignature = (signature) => ({
  type: SET_PROFILE_SIGNATURE,
  signature,
})

