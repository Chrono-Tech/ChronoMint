import Immutable from 'immutable'

import contractsManagerDAO from 'dao/ContractsManagerDAO'
import type PollModel from 'models/PollModel'
import type PollNoticeModel from 'models/notices/PollNoticeModel'
import { IS_CREATED, IS_REMOVED, IS_ACTIVATED } from 'models/notices/PollNoticeModel'

import { POLLS_LOAD, POLLS_LIST, POLLS_CREATE, POLLS_REMOVE, POLLS_ACTIVATE } from 'redux/voting/reducer'
import { notify } from 'redux/notifier/actions'

export const watchPoll = (notice: PollNoticeModel) => async (dispatch/*, getState*/) => {
  switch (notice.status()) {
    case IS_CREATED:
      dispatch(handlePollCreated(notice.poll))
      break
    case IS_REMOVED:
      dispatch(handlePollRemoved(notice.poll))
      break
    case IS_ACTIVATED:
      dispatch(handlePollActivated(notice.poll))
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
    dao.watchActivated(callback)
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

export const activatePoll = (pollId: Number) => async () => {
  const dao = await contractsManagerDAO.getVotingDAO()
  await dao.activatePoll(pollId)
}

export const handlePollCreated = (poll: PollModel) => async (dispatch) => {
  dispatch({type: POLLS_CREATE, poll})
}

export const handlePollRemoved = (poll: PollModel) => async (dispatch) => {
  dispatch({type: POLLS_REMOVE, poll})
}

export const handlePollActivated = (poll: PollModel) => async (dispatch) => {
  dispatch({type: POLLS_ACTIVATE, poll})
}

export const listPolls = () => async (dispatch) => {

  dispatch({ type: POLLS_LOAD })

  let list = []
  try {

    const dao = await contractsManagerDAO.getVotingDetailsDAO()
    const count = await dao.pollsCount()

    if (count > 0) {
      const promises = []
      for (let i = 0; i < count; i++) {
        promises.push(dao.getPollDetails(i + 1))
      }
      list = await Promise.all(promises)
    }
  } finally {
    dispatch({
      type: POLLS_LIST,
      list: list.reduce((m, details) => {
        return m.set(details.poll().index(), details)
      }, new Immutable.Map()) })
  }
}
