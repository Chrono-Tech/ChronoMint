import Immutable from 'immutable'

import type PollModel from 'models/PollModel'
import type PollNoticeModel from 'models/notices/PollNoticeModel'

import { IS_CREATED, IS_REMOVED/*, IS_UPDATED*/ } from 'models/notices/PollNoticeModel'
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
    // case IS_UPDATED:
    //   dispatch(updatePoll(notice.poll))
    //   break
  }
  dispatch(notify(notice))
}

export const watchPolls = () => async (dispatch) => {

  const callback = (notice) => dispatch(watchPoll(notice))

  const dao = await contractsManagerDAO.getVoteDAO()

  return Promise.all([
    dao.watchCreated(callback),
    // dao.watchUpdated(callback),
    dao.watchRemoved(callback)
  ])
}

export const createPoll = (poll: PollModel) => async () => {
  console.log('createPoll', poll)
  const dao = await contractsManagerDAO.getVoteDAO()
  await dao.createPoll(poll)
}

export const removePoll = (poll: PollModel) => async () => {
  const dao = await contractsManagerDAO.getVoteDAO()
  await dao.removePoll(poll)
}

// export const updatePoll = (poll: PollModel) => async () => {
//   const dao = await contractsManagerDAO.getVoteDAO()
//   await dao.updatePoll(poll)
// }

export const loadPolls = () => async (dispatch) => {

  dispatch({ type: POLLS_LOAD })

  let list = []
  try {
    const dao = await contractsManagerDAO.getVoteDAO()
    const count = await dao.pollsCount()
    const promises = []
    for (let i = 0; i < count; i++) {
      promises.push(dao.getPoll(i))
    }
    list = Promise.all(promises)
  } finally {
    dispatch({
      type: POLLS_LIST,
      list: list.reduce((m, element) => {
        console.log('Poll item: ', element)
        return m.set()
      }, new Immutable.Map()) })
  }
}
