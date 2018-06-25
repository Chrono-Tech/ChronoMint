/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_SESSION } from '../session/actions'
import votingService from '../../services/VotingService'
import contractsManagerDAO from '../../dao/ContractsManagerDAO'
import { EVENT_POLL_ACTIVATED, EVENT_POLL_ENDED, EVENT_POLL_VOTED } from '../../dao/PollEmitterDAO'
import type PollNoticeModel from '../../models/notices/PollNoticeModel'
import { IS_ACTIVATED, IS_CREATED, IS_ENDED, IS_REMOVED, IS_UPDATED, IS_VOTED } from '../../models/notices/PollNoticeModel'
import PollDetailsModel from '../../models/PollDetailsModel'
import PollModel from '../../models/PollModel'
import { notify } from '../notifier/actions'
import { EVENT_POLL_CREATED, EVENT_POLL_REMOVED } from '../../dao/VotingManagerDAO'

export const POLLS_VOTE_LIMIT = 'voting/POLLS_LIMIT'
export const POLLS_LOAD = 'voting/POLLS_LOAD'
export const POLLS_LIST = 'voting/POLLS_LIST'
export const POLLS_CREATE = 'voting/POLLS_CREATE'
export const POLLS_REMOVE = 'voting/POLLS_REMOVE'
export const POLLS_UPDATE = 'voting/POLLS_UPDATE'

export const DUCK_VOTING = 'voting'
const PAGE_SIZE = 20

// used to create unique ID for fetching models
let counter = 1

export const watchPoll = (notice: PollNoticeModel) => async (dispatch) => {
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

export const updateVoteLimit = () => async (dispatch) => {
  const votingDAO = await contractsManagerDAO.getVotingManagerDAO()
  const [ voteLimitInTIME, voteLimitInPercent ] = await Promise.all([
    votingDAO.getVoteLimit(),
    votingDAO.getVoteLimitInPercent(),
  ])
  dispatch({ type: POLLS_VOTE_LIMIT, voteLimitInTIME, voteLimitInPercent: voteLimitInPercent.div(100) })
}

export const watchInitPolls = () => async (dispatch, getState) => {
  const callback = (notice) => dispatch(watchPoll(notice))
  const { account } = getState().get(DUCK_SESSION)
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

export const createPoll = (poll: PollDetailsModel) => async (dispatch) => {
  const id = `stub_${--counter}`
  const stub = poll.id(id).isFetching(true)

  try {
    dispatch(handlePollCreated(stub))
    const dao = await contractsManagerDAO.getVotingManagerDAO()
    const transactionHash = await dao.createPoll(poll.poll())
    dispatch(handlePollRemoved(stub.id()))
    dispatch(handlePollUpdated(stub.transactionHash(transactionHash)))
  } catch (e) {
    // eslint-disable-next-line
    console.error('create poll error', e.message)
    dispatch(handlePollRemoved(stub.id()))
  }
}

export const removePoll = (poll: PollDetailsModel) => async (dispatch) => {
  try {
    dispatch(handlePollRemoved(poll.id()))
    const dao = await contractsManagerDAO.getPollInterfaceDAO(poll.id())
    await dao.removePoll()
  } catch (e) {
    dispatch(handlePollCreated(poll))
    throw e
  }
}

export const vote = (poll: PollDetailsModel, choice: Number) => async (dispatch) => {
  try {
    dispatch(handlePollUpdated(poll.isFetching(true)))
    const options = poll.voteEntries()
    const dao = await contractsManagerDAO.getPollInterfaceDAO(poll.id())
    await dao.vote(choice, options.get(choice - 1))
  } catch (e) {
    dispatch(handlePollUpdated(poll))
    throw e
  }
}

export const activatePoll = (poll: PollDetailsModel) => async (dispatch) => {
  try {
    dispatch(handlePollUpdated(poll
      .poll(poll.poll().active(true))
      .isFetching(true)))
    const dao = await contractsManagerDAO.getPollInterfaceDAO(poll.id())
    await dao.activatePoll()
  } catch (e) {
    dispatch(handlePollUpdated(poll))
  }
}

export const endPoll = (poll: PollDetailsModel) => async (dispatch) => {
  try {
    dispatch(handlePollUpdated(poll
      .set('poll', poll.poll()
        .set('active', false)
        .set('status', false))
      .isFetching(true)))
    const dao = await contractsManagerDAO.getPollInterfaceDAO(poll.id())
    await dao.endPoll()
  } catch (e) {
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
  const dao = await contractsManagerDAO.getVotingManagerDAO()
  const votingState = getState().get(DUCK_VOTING)
  const { account } = getState().get(DUCK_SESSION)
  return dao.getPollsPaginated(votingState.lastPoll(), PAGE_SIZE, account)
}
