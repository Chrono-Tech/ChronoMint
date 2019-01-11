/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_VOTING } from '../constants'

export const getVoting = (state) => {
  return state.get(DUCK_VOTING)
}

export const getPolls = (state) => {
  return getVoting(state).list()
}

export const getSelectedPollFromDuck = (state) => {
  return getPolls(state).item(state.get(DUCK_VOTING).selectedPoll())
}

export const getLastVoting = (state) => {
  return getVoting(state).lastPoll()
}
