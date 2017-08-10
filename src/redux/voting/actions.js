import Immutable from 'immutable'

import type PollModel from 'models/PollModel'
import type PollNoticeModel from 'models/notices/PollNoticeModel'

import { IS_CREATED, IS_REMOVED, IS_UPDATED } from 'models/notices/PollNoticeModel'
import { POLLS_LOAD, POLLS_LIST } from 'redux/voting/reducer'
import { notify } from 'redux/notifier/actions'
import contractsManagerDAO from 'dao/ContractsManagerDAO'

export const watchPoll = (notice: PollNoticeModel) => async (dispatch/*, getState*/) => {
  switch (notice.status()) {
    case IS_CREATED:
      dispatch(createPoll(notice.poll))
      break
    case IS_REMOVED:
      dispatch(removePoll(notice.poll))
      break
    case IS_UPDATED:
      dispatch(updatePoll(notice.poll))
      break
  }
  dispatch(notify(notice))
}

export const watchInitPolls = () => async (dispatch) => {

  const callback = (notice) => {
    return dispatch(watchPoll(notice))
  }

  const dao = await contractsManagerDAO.getVotingDAO()

  const mm = await Promise.all([
    dao.watchCreated(callback),
    dao.watchUpdated(callback),
    dao.watchRemoved(callback)
  ])
  return mm
}

export const createPoll = (poll: PollModel) => async () => {
  const dao = await contractsManagerDAO.getVotingDAO()
  await dao.createPoll(poll)
}

export const removePoll = (poll: PollModel) => async () => {
  const dao = await contractsManagerDAO.getVotingDAO()
  await dao.removePoll(poll)
}

export const updatePoll = (poll: PollModel) => async () => {
  const dao = await contractsManagerDAO.getVotingDAO()
  await dao.updatePoll(poll)
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
        promises.push(dao.getPoll(i + 1))
      }
      list = await Promise.all(promises)
    }
  } finally {
    dispatch({
      type: POLLS_LIST,
      list: list.reduce((m, element) => {
        return m.set(element.index(), element)
      }, new Immutable.Map()) })
  }
}
