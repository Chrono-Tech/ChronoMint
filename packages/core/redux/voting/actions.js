/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { push } from '@chronobank/core-dependencies/router'
import votingService from '../../services/VotingService'
import type PollNoticeModel from '../../models/notices/PollNoticeModel'
import PollDetailsModel from '../../models/PollDetailsModel'
import { notify } from '../notifier/actions'
import { PTPoll } from './types'
import { getSelectedPollFromDuck, getVoting } from './selectors/models'
import { daoByType } from '../daos/selectors'
import PollModel from '../../models/PollModel'

//#region CONSTANTS

import {
  DUCK_SESSION,
} from '../session/constants'
import {
  IS_ACTIVATED,
  IS_CREATED,
  IS_ENDED,
  IS_REMOVED,
  IS_UPDATED,
  IS_VOTED,
} from '../../models/constants/PollNoticeModel'
import {
  EVENT_POLL_ACTIVATED,
  EVENT_POLL_CREATED,
  EVENT_POLL_ENDED,
  EVENT_POLL_REMOVED,
  EVENT_POLL_VOTED,
} from '../../dao/constants/PollEmitterDAO'
import {
  DUCK_VOTING,
  POLLS_CREATE,
  POLLS_LIST,
  POLLS_LOAD,
  POLLS_REMOVE,
  POLLS_UPDATE,
  POLLS_VOTE_LIMIT,
} from './constants'

//#endregion

const PAGE_SIZE = 20

// used to create unique ID for fetching models
let counter = 1

export const goToVoting = () => (dispatch) => dispatch(push('/voting'))

export const watchPoll = (notice: PollNoticeModel) => async (dispatch) => {
  console.log('watchPoll: ', notice)
  switch (notice.status()) {
    case IS_CREATED:
      dispatch(handlePollRemoved(notice.transactionHash()))
      dispatch(handlePollCreated(notice.poll()))
      break
    case IS_REMOVED:
      dispatch(handlePollRemoved(notice.pollId()))
      break
    case IS_ACTIVATED:
      dispatch(handlePollUpdated(notice.poll()))
      break
    case IS_ENDED:
      dispatch(handlePollUpdated(notice.poll()))
      break
    case IS_VOTED:
    case IS_UPDATED:
      dispatch(handlePollUpdated(notice.poll()))
      break
  }
  dispatch(notify(notice))
}

export const updateVoteLimit = () => async (dispatch, getState) => {
  const votingDAO = daoByType('VotingManager')(getState())
  const [voteLimitInTIME, voteLimitInPercent] = await Promise.all([
    votingDAO.getVoteLimit(),
    votingDAO.getVoteLimitInPercent(),
  ])
  dispatch({ type: POLLS_VOTE_LIMIT, voteLimitInTIME, voteLimitInPercent: new BigNumber(voteLimitInPercent).div(100) })
}

export const watchInitPolls = () => async (dispatch, getState) => {
  const callback = (notice) => dispatch(watchPoll(notice))
  const { account } = getState().get(DUCK_SESSION)
  const votingManagerDAO = daoByType('VotingManager')(getState())
  votingService
    .setVotingManager(votingManagerDAO)
  votingService
    .subscribeToVoting(account)

  votingService
    .on(EVENT_POLL_CREATED, callback)
    .on(EVENT_POLL_REMOVED, callback)
    .on(EVENT_POLL_ACTIVATED, callback)
    .on(EVENT_POLL_ENDED, callback)
    .on(EVENT_POLL_VOTED, callback)

  return Promise.all([
    dispatch(updateVoteLimit()),
  ])
}

export const createPoll = (poll: PollDetailsModel) => async (dispatch, getState) => {
  const id = `stub_${--counter}`
  const stub = poll.mutate({ id: id, isFetching: true })
  const votingDAO = daoByType('VotingManager')(getState())

  try {
    dispatch(handlePollCreated(stub))
    dispatch(goToVoting())
    await votingDAO.createPoll(poll.poll, { stubPoll: stub })
  } catch (e) {
    dispatch(handlePollRemoved(stub.id))
  }
}

export const removePoll = (pollObject: PTPoll) => async (dispatch, getState) => {
  console.log('removePoll: ', pollObject)
  const state = getState()
  const votingDAO = daoByType('VotingManager')(getState())

  let poll = pollObject && pollObject.id
    ? getVoting(state).list().item(pollObject.id)
    : getSelectedPollFromDuck(state)

  try {
    dispatch(handlePollRemoved(poll.id))
    dispatch(goToVoting())
    const dao = await votingDAO.pollInterfaceManagerDAO.getPollInterfaceDAO(poll.id)

    await dao.removePoll({ symbol: 'TIME', blockchain: 'Ethereum' })
  } catch (e) {
    console.log('removePoll error: ', e)
    dispatch(handlePollCreated(poll))
    throw e
  }
}

export const vote = (choice: Number) => async (dispatch, getState) => {
  console.log('vote: ', choice)

  const poll = getSelectedPollFromDuck(getState())
  const votingDAO = daoByType('VotingManager')(getState())

  try {
    dispatch(handlePollUpdated(poll.isFetching(true)))
    const options = poll.voteEntries()
    const dao = await votingDAO.pollInterfaceManagerDAO.getPollInterfaceDAO(poll.id)
    await dao.vote(choice, options.get(choice), { symbol: 'TIME' })
  } catch (e) {
    console.log('Vote poll error: ', e)
    dispatch(handlePollUpdated(poll))
    throw e
  }
}

export const activatePoll = (pollObject: PTPoll) => async (dispatch, getState) => {
  console.log('activatePoll: ', pollObject)

  const state = getState()
  const votingDAO = daoByType('VotingManager')(getState())

  let poll = pollObject && pollObject.id
    ? getVoting(state).list().item(pollObject.id)
    : getSelectedPollFromDuck(state)

  try {
    dispatch(handlePollUpdated(poll.mutate({ poll: new PollModel({ ...poll.poll, active: true, isFetching: true }) })))

    const dao = await votingDAO.pollInterfaceManagerDAO.getPollInterfaceDAO(poll.id)
    await dao.activatePoll({ symbol: 'TIME' })
  } catch (e) {
    console.log('Active poll error: ', e)
    dispatch(handlePollUpdated(poll))
  }
}

export const endPoll = (pollObject: PTPoll) => async (dispatch, getState) => {
  console.log('endPoll: ', pollObject)

  const poll = getState().get(DUCK_VOTING).list().item(pollObject.id)
  const votingDAO = daoByType('VotingManager')(getState())

  try {
    dispatch(handlePollUpdated(poll
      .set('poll', poll.poll.mutate({
        active: false,
        status: false,
        isFetching: true,
      }))))
    const dao = await votingDAO.pollInterfaceManagerDAO.getPollInterfaceDAO(poll.id)
    await dao.endPoll({ symbol: 'TIME' })
  } catch (e) {
    console.log('End poll error: ', e)
    dispatch(handlePollUpdated(poll))
  }
}

export const handlePollCreated = (poll: PollDetailsModel) => async (dispatch) => {
  poll && dispatch({ type: POLLS_CREATE, poll })
}

export const handlePollRemoved = (id: Number) => async (dispatch) => {
  dispatch({ type: POLLS_REMOVE, id })
}

export const handlePollUpdated = (poll: PollDetailsModel) => async (dispatch) => {
  dispatch({ type: POLLS_UPDATE, poll })
}

export const listPolls = () => async (dispatch) => {
  dispatch({ type: POLLS_LOAD })
  const list = await dispatch(getNextPage())
  dispatch({ type: POLLS_LIST, list })
}

export const getNextPage = () => async (dispatch, getState) => {
  const dao = daoByType('VotingManager')(getState())

  const votingState = getState().get(DUCK_VOTING)
  const { account } = getState().get(DUCK_SESSION)
  return dao.getPollsPaginated(votingState.lastPoll(), PAGE_SIZE, account)
}
