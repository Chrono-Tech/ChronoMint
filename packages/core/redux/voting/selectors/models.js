/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_VOTING } from '../constants'

export const selectVoting = (state) =>
  state.get(DUCK_VOTING)

export const selectPollsList = (state) =>
  selectVoting(state).list()

export const getSelectedPollFromDuck = (state) => {
  const selectedPoll = selectVoting(state).selectedPoll()
  return selectPollsList(state).item(selectedPoll)
}
