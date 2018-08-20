/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { navigateToVoting } from 'redux/ui/navigation'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import { removePoll, createPoll } from '@chronobank/core/redux/voting/thunks'
import type PollDetailsModel from '@chronobank/core/models/PollDetailsModel'

export const removePollAndNavigateToVotings = (pollObject: PTPoll) => async (dispatch) => {
  dispatch(navigateToVoting())
  dispatch(removePoll(pollObject))
}

export const createPollAndNavigateToVotings = (poll: PollDetailsModel) => async (dispatch) => {
  dispatch(navigateToVoting())
  dispatch(createPoll(poll))
}
