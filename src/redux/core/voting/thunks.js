/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as CoreVotingThunks from '@chronobank/core/redux/voting/actions'
import { navigateToWallets, navigateToVoting } from 'redux/ui/navigation'
import type PollDetailsModel from '@chronobank/core/models/PollDetailsModel'
import {
  createPoll,
  removePoll,
} from '@chronobank/core/redux/voting/thunks'

export const createPollAndNavigateToWallets = (poll: PollDetailsModel) => (dispatch) => {
  dispatch(navigateToWallets())
  dispatch(CoreVotingThunks.createPoll(poll))
}

export const removePollAndNavigateToVoting = (pollObject) => (dispatch) => {
  // TODO: there was a navigation action right in the middle of 'removeVoting' action,
  // need to clarify correct order, navigate->remove or remove->navigate
  dispatch(removePoll(pollObject))
  dispatch(navigateToVoting())
}

export const createPollAndNavigateToVoting = (poll: PollDetailsModel) => (dispatch) => {
  dispatch(navigateToVoting())
  dispatch(createPoll(poll))
}
