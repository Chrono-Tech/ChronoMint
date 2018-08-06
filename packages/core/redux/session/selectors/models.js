/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_SESSION } from '../constants'

export const getAccount = (state) => {
  const { account } = state.get(DUCK_SESSION)
  return account
}

export const getProfile = (state) => {
  const { profile } = state.get(DUCK_SESSION)
  return profile
}

export const getGasSliderCollection = (state) => {
  const { gasPriceMultiplier } = state.get(DUCK_SESSION)
  return gasPriceMultiplier
}

export const getIsCBE = (state) => {
  return state.get(DUCK_SESSION).isCBE
}
