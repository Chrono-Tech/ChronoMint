/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as CoreVotingThunks from '@chronobank/core/redux/voting/actions'
import { navigateToWallets } from 'redux/ui/navigation'
import type PollDetailsModel from '@chronobank/core/models/notices/PollDetailsModel'

// eslint-disable-next-line import/prefer-default-export
export const createPoll = (poll: PollDetailsModel) => async (dispatch) => {
  dispatch(navigateToWallets())
  dispatch(CoreVotingThunks.createPoll(poll))
}
