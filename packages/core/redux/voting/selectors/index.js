/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import { getPolls, getSelectedPollFromDuck, getVoting } from './models'
import VotingCollection from '../../../models/voting/VotingCollection'
import PollDetailsModel from '../../../models/PollDetailsModel'
import VotingMainModel from '../../../models/voting/VotingMainModel'

const getPollsDetailsFromDuck = createSelector(
  [
    getPolls,
  ],
  (polls: VotingCollection) => {
    const pollsArray = polls
      .list()
      .map((poll: PollDetailsModel) => poll.details())
      .toArray()
    console.log('getPollsDetailsFromDuck: ', polls.toJSON(), pollsArray)
    return pollsArray
  },
)

const getPollDetailsFromDuck = createSelector(
  [
    getSelectedPollFromDuck,
  ],
  (poll: PollDetailsModel) => {
    return poll ? poll.details() : null
  },
)

const getVotingFlagsFromDuck = createSelector(
  [
    getVoting,
  ],
  (voting: VotingMainModel) => {
    return {
      isFetched: voting.isFetched(),
      isFetching: voting.isFetching() && !voting.isFetched(),
    }
  },
)

const createSectionsSelector = createSelectorCreator(
  defaultMemoize,
  (objA, objB) => {
    if (objA === objB) {
      return true
    }

    if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
      return false
    }

    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) {
      return false
    }

    // Test for A's keys different from B.
    const bHasOwnProperty = hasOwnProperty.bind(objB)
    for (let i = 0; i < keysA.length; i++) {
      if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false
      }
    }

    return true
  },
)

export const getPollsDetailsList = () => createSectionsSelector(
  [
    getPollsDetailsFromDuck,
  ],
  (
    pollsList,
  ) => pollsList,
)

export const getVotingFlags = () => createSectionsSelector(
  [
    getVotingFlagsFromDuck,
  ],
  (
    flags,
  ) => flags,
)

export const getSelectedPoll = () => createSectionsSelector(
  [
    getPollDetailsFromDuck,
  ],
  (
    poll,
  ) => poll,
)
