import contractsManagerDAO from 'dao/ContractsManagerDAO'
import Immutable from 'immutable'
import type PollNoticeModel from 'models/notices/PollNoticeModel'
import { IS_ACTIVATED, IS_CREATED, IS_ENDED, IS_REMOVED, IS_UPDATED, IS_VOTED } from 'models/notices/PollNoticeModel'
import PollDetailsModel from 'models/PollDetailsModel'
import PollModel from 'models/PollModel'
import TokenModel from 'models/tokens/TokenModel'
import { notify } from 'redux/notifier/actions'
import { DUCK_TOKENS, subscribeOnTokens } from 'redux/tokens/actions'

export const POLLS_INIT = 'voting/INIT'
export const POLLS_VOTE_LIMIT = 'voting/POLLS_LIMIT'
export const POLLS_LOAD = 'voting/POLLS_LOAD'
export const POLLS_LIST = 'voting/POLLS_LIST'
export const POLLS_CREATE = 'voting/POLLS_CREATE'
export const POLLS_REMOVE = 'voting/POLLS_REMOVE'
export const POLLS_REMOVE_STUB = 'voting/POLLS_REMOVE_STUB'
export const POLLS_UPDATE = 'voting/POLLS_UPDATE'

export const DUCK_VOTING = 'voting'

// used to create unique ID for fetching models
let counter = 0

export const watchPoll = (notice: PollNoticeModel) => async (dispatch) => {
  switch (notice.status()) {
    case IS_CREATED:
      dispatch(handlePollRemovedStub(notice.transactionHash()))
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

const updateVoteLimit = () => async (dispatch) => {
  const callback = async (token: TokenModel) => {
    const votingDAO = await contractsManagerDAO.getVotingDAO()
    const voteLimitInTIME = await votingDAO.getVoteLimit(token)
    dispatch({ type: POLLS_VOTE_LIMIT, voteLimitInTIME })
  }

  dispatch(subscribeOnTokens((token: TokenModel) => async () => {
    if (token.symbol() === 'TIME') {
      await callback(token)
    }
  }))
}

export const watchInitPolls = () => async (dispatch, getState) => {
  if (getState().get(DUCK_VOTING).isInited()) {
    return
  }
  dispatch({ type: POLLS_INIT, isInited: true })

  const callback = (notice) => dispatch(watchPoll(notice))

  const dao = await contractsManagerDAO.getVotingDAO()
  const votingActorDAO = await contractsManagerDAO.getVotingActorDAO()

  return await Promise.all([
    dispatch(updateVoteLimit()),
    dao.watchCreated(callback),
    dao.watchRemoved(callback),
    dao.watchActivated(callback),
    dao.watchEnded(callback),
    votingActorDAO.watchVoted(callback),
    // dao.watchUpdated(callback)
  ])
}

export const createPoll = (poll: PollModel) => async (dispatch, getState) => {
  const time = getState().get(DUCK_TOKENS).item('TIME')
  const stub = new PollDetailsModel({
    poll: poll.set('id', --counter),
  })
  try {
    dispatch(handlePollCreated(stub.isFetching(true)))
    const dao = await contractsManagerDAO.getVotingDAO()
    const transactionHash = await dao.createPoll(poll, time)
    dispatch(handlePollUpdated(stub.transactionHash(transactionHash)))
  } catch (e) {
    // eslint-disable-next-line
    console.error('create poll error', e.message)
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
    dispatch(handlePollRemoved(poll.poll()))
    const dao = await contractsManagerDAO.getVotingDAO()
    await dao.removePoll(poll.poll().id())
  } catch (e) {
    dispatch(handlePollCreated(poll))
    throw e
  }
}

export const vote = (poll: PollDetailsModel, choice: Number) => async (dispatch) => {
  try {
    dispatch(handlePollUpdated(poll.isFetching(true)))
    const dao = await contractsManagerDAO.getVotingActorDAO()
    await dao.vote(poll.poll().id(), choice)
  } catch (e) {
    dispatch(handlePollUpdated(poll))
    throw e
  }
}

export const activatePoll = (poll: PollDetailsModel) => async (dispatch) => {
  try {
    dispatch(handlePollUpdated(poll
      .set('poll', poll.poll().set('active', true))
      .isFetching(true)))
    const dao = await contractsManagerDAO.getVotingDAO()
    await dao.activatePoll(poll.poll().id())
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
    const dao = await contractsManagerDAO.getVotingDAO()
    await dao.endPoll(poll.poll().id())
  } catch (e) {
    dispatch(handlePollUpdated(poll))
  }
}

export const handlePollCreated = (poll: PollDetailsModel) => async (dispatch) => {
  dispatch({ type: POLLS_CREATE, poll })
}

export const handlePollRemoved = (item: PollModel) => async (dispatch) => {
  dispatch({ type: POLLS_REMOVE, item })
}

export const handlePollRemovedStub = (transactionHash: String) => async (dispatch) => {
  dispatch({ type: POLLS_REMOVE_STUB, transactionHash })
}

export const handlePollUpdated = (poll: PollDetailsModel) => async (dispatch) => {
  dispatch({ type: POLLS_UPDATE, poll })
}

export const listPolls = () => async (dispatch) => {
  dispatch(getPolls())
}

const getPolls = () => async (dispatch) => {
  dispatch({ type: POLLS_LOAD })
  let list = []
  try {
    const dao = await contractsManagerDAO.getVotingDetailsDAO()
    list = await dao.getPolls()
  } finally {
    dispatch({
      type: POLLS_LIST,
      list: list.reduce((m, details) => m.set(details.poll().id(), details), new Immutable.Map()),
    })
  }
}
