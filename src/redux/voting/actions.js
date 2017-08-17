import Immutable from 'immutable'

import contractsManagerDAO from 'dao/ContractsManagerDAO'
import type PollNoticeModel from 'models/notices/PollNoticeModel'
import PollModel from 'models/PollModel'
import PollDetailsModel from 'models/PollDetailsModel'
import { IS_CREATED, IS_REMOVED, IS_ACTIVATED, IS_ENDED, IS_UPDATED, IS_VOTED } from 'models/notices/PollNoticeModel'

import { POLLS_LOAD, POLLS_LIST, POLLS_CREATE, POLLS_REMOVE, POLLS_UPDATE } from 'redux/voting/reducer'
import { notify } from 'redux/notifier/actions'

// used to create unique ID for fetching models
let counter = 0

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

export const createPoll = (poll: PollModel) => async (dispatch) => {
  const stub = new PollDetailsModel({
    poll: poll.set('id', --counter)
  })
  try {
    dispatch(handlePollCreated(stub.fetching()))
    const dao = await contractsManagerDAO.getVotingDAO()
    await dao.createPoll(poll)
  } finally {
    dispatch(handlePollRemoved(stub.poll().id()))
  }
}

// eslint-disable-next-line
export const updatePoll = (poll: PollModel) => async () => {
  // TODO @ipavlenko: Implement when contracts will support it
  // const dao = await contractsManagerDAO.getVotingDAO()
  // await dao.updatePoll(poll)
}

export const removePoll = (poll: PollDetailsModel) => async (dispatch) => {
  try {
    dispatch(handlePollRemoved(poll.poll().id()))
    const dao = await contractsManagerDAO.getVotingDAO()
    await dao.removePoll(poll.poll().id())
  } catch (e) {
    dispatch(handlePollCreated(poll))
    throw e
  }
}

export const vote = (poll: PollDetailsModel, choice: Number) => async (dispatch) => {
  try {
    dispatch(handlePollUpdated(poll.fetching()))
    const dao = await contractsManagerDAO.getVotingActorDAO()
    await dao.vote(poll.poll().id(), choice)
  } catch (e) {
    dispatch(handlePollUpdated(poll))
    throw e
  }
}

export const activatePoll = (poll: PollDetailsModel) => async (dispatch) => {
  try {
    dispatch(handlePollUpdated(
      poll
        .set('poll', poll.poll().set('active', true))
        .fetching()
    ))
    const dao = await contractsManagerDAO.getVotingDAO()
    await dao.activatePoll(poll.poll().id())
  } catch (e) {
    dispatch(handlePollUpdated(poll))
  }
}

export const endPoll = (poll: PollDetailsModel) => async (dispatch) => {
  try {
    dispatch(handlePollUpdated(
      poll
        .set('poll', poll.poll()
          .set('active', false)
          .set('status', false)
        )
        .fetching()
    ))
    const dao = await contractsManagerDAO.getVotingDAO()
    await dao.endPoll(poll)
  } catch (e) {
    dispatch(handlePollUpdated(poll))
  }
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
