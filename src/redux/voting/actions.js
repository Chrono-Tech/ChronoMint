import Immutable from 'immutable'

import contractsManagerDAO from 'dao/ContractsManagerDAO'
import type PollModel from 'models/PollModel'
import type PollDetailsModel from 'models/PollDetailsModel'
import type PollNoticeModel from 'models/notices/PollNoticeModel'
import { IS_CREATED, IS_REMOVED, IS_ACTIVATED, IS_ENDED, IS_UPDATED, IS_VOTED } from 'models/notices/PollNoticeModel'

import { POLLS_LOAD, POLLS_LIST, POLLS_CREATE, POLLS_REMOVE, POLLS_UPDATE } from 'redux/voting/reducer'
import { notify } from 'redux/notifier/actions'

export const watchPoll = (notice: PollNoticeModel) => async (dispatch/*, getState*/) => {
  switch (notice.status()) {
    case IS_CREATED:
      dispatch(handlePollCreated(notice.poll()))
      break
    case IS_REMOVED:
      dispatch(handlePollRemoved(notice.pollId()))
      break
    case IS_ACTIVATED:
    case IS_ENDED:
    case IS_VOTED:
    case IS_UPDATED:
      dispatch(handlePollUpdated(notice.poll()))
      break
  }
  dispatch(notify(notice))
}

export const watchInitPolls = () => async (dispatch) => {

  const callback = (notice) => {
    return dispatch(watchPoll(notice))
  }

  const dao = await contractsManagerDAO.getVotingDAO()

  return await Promise.all([
    dao.watchCreated(callback),
    dao.watchRemoved(callback),
    dao.watchActivated(callback),
    dao.watchEnded(callback),
    dao.watchVoted(callback),
    // dao.watchUpdated(callback)
  ])
}

export const createPoll = (poll: PollModel) => async () => {
  const dao = await contractsManagerDAO.getVotingDAO()
  await dao.createPoll(poll)
}

export const removePoll = (pollId: Number) => async () => {
  const dao = await contractsManagerDAO.getVotingDAO()
  await dao.removePoll(pollId)
}

export const updatePoll = (poll: PollModel) => async () => {
  const dao = await contractsManagerDAO.getVotingDAO()
  await dao.updatePoll(poll)
}

export const vote = (poll: PollModel, choice: Number) => async () => {
  const dao = await contractsManagerDAO.getVotingActorDAO()
  await dao.vote(poll.id(), choice)
}

export const activatePoll = (pollId: Number) => async () => {
  const dao = await contractsManagerDAO.getVotingDAO()
  await dao.activatePoll(pollId)
}

export const endPoll = (pollId: Number) => async () => {
  const dao = await contractsManagerDAO.getVotingDAO()
  await dao.endPoll(pollId)
}

export const handlePollCreated = (poll: PollDetailsModel) => async (dispatch) => {
  dispatch({type: POLLS_CREATE, poll})
}

export const handlePollRemoved = (id: Number) => async (dispatch) => {
  dispatch({type: POLLS_REMOVE, id})
}

export const handlePollUpdated = (poll: PollDetailsModel) => async (dispatch) => {
  dispatch({type: POLLS_UPDATE, poll})
}

export const listPolls = () => async (dispatch) => {

  dispatch({ type: POLLS_LOAD })

  let list = []
  try {
    const dao = await contractsManagerDAO.getVotingDetailsDAO()
    list = await dao.getPolls()
  } finally {
    dispatch({
      type: POLLS_LIST,
      list: list.reduce((m, details) => {
        return m.set(details.poll().id(), details)
      }, new Immutable.Map()) })
  }
}
