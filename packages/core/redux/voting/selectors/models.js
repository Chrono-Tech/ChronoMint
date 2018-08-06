/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_VOTING } from '../constants'

/**
 * SIMPLE SELECTORS
 * ==============================================================================
 */

export const getPolls = (state) => {
  return state.get(DUCK_VOTING).list()
}

export const getVoting = (state) => {
  return state.get(DUCK_VOTING)
}

export const getSelectedPollFromDuck = (state) => {
  return state.get(DUCK_VOTING).list().item(state.get(DUCK_VOTING).selectedPoll())
}
