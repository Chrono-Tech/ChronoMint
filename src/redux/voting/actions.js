import votingService from 'services/VotingService'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { EVENT_POLL_ACTIVATED, EVENT_POLL_ENDED, EVENT_POLL_VOTED } from 'dao/PollEmitterDAO'
import type PollNoticeModel from 'models/notices/PollNoticeModel'
import { IS_ACTIVATED, IS_CREATED, IS_ENDED, IS_REMOVED, IS_UPDATED, IS_VOTED } from 'models/notices/PollNoticeModel'
import PollDetailsModel from 'models/PollDetailsModel'
import PollModel from 'models/PollModel'
import { notify } from 'redux/notifier/actions'
import { EVENT_POLL_CREATED, EVENT_POLL_REMOVED } from 'dao/VotingManagerDAO'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { TIME } from 'redux/mainWallet/actions'
import TokenModel from 'models/tokens/TokenModel'

export const POLLS_VOTE_LIMIT = 'voting/POLLS_LIMIT'
export const POLLS_LOAD = 'voting/POLLS_LOAD'
export const POLLS_LIST = 'voting/POLLS_LIST'
export const POLLS_CREATE = 'voting/POLLS_CREATE'
export const POLLS_REMOVE = 'voting/POLLS_REMOVE'
export const POLLS_UPDATE = 'voting/POLLS_UPDATE'
export const VOTING_POLLS_COUNT = 'voting/VOTING_POLLS_COUNT'

export const DUCK_VOTING = 'voting'
const PAGE_SIZE = 20

// used to create unique ID for fetching models
let counter = 1

export const watchPoll = (notice: PollNoticeModel) => async (dispatch, getState) => {
  const state = getState().get(DUCK_VOTING)
  switch (notice.status()) {
    case IS_CREATED:
      dispatch(handlePollRemoved(notice.transactionHash()))
      dispatch(handlePollCreated(notice.poll()))
      break
    case IS_REMOVED:
      dispatch(handlePollRemoved(notice.pollId()))
      break
    case IS_ACTIVATED:
      dispatch(handlePollUpdated(notice.poll()), state.activePollsCount().plus(1))
      break
    case IS_ENDED:
      dispatch(handlePollUpdated(notice.poll()), state.activePollsCount().minus(1))
      break
    case IS_VOTED:
    case IS_UPDATED:
      dispatch(handlePollUpdated(notice.poll()))
      break
  }
  dispatch(notify(notice))
}

const updateVoteLimit = () => async (dispatch) => {
  const votingDAO = await contractsManagerDAO.getVotingManagerDAO()
  const voteLimitInTIME = await votingDAO.getVoteLimit()
  dispatch({ type: POLLS_VOTE_LIMIT, voteLimitInTIME })
}

export const watchInitPolls = () => async (dispatch) => {
  const callback = (notice) => dispatch(watchPoll(notice))
  votingService
    .subscribeToVoting()

  votingService
    .on(EVENT_POLL_CREATED, callback)
    .on(EVENT_POLL_REMOVED, callback)
    .on(EVENT_POLL_ACTIVATED, callback)
    .on(EVENT_POLL_ENDED, callback)
    .on(EVENT_POLL_VOTED, callback)

  return await Promise.all([
    dispatch(updateVoteLimit()),
  ])
}

export const createPoll = (poll: PollModel) => async (dispatch, getState) => {
  const time: TokenModel = getState().get(DUCK_TOKENS).item(TIME)
  const stub = new PollDetailsModel({
    id: `stub_${--counter}`,
    poll: poll.id(`stub_${counter}`),
  }).isFetching(true)

  try {
    dispatch(handlePollCreated(stub))
    const dao = await contractsManagerDAO.getVotingManagerDAO()
    const transactionHash = await dao.createPoll(poll, time)
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
    const dao = await contractsManagerDAO.getPollInterfaceDAO(poll.id())
    await dao.vote(choice)
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

export const handlePollUpdated = (poll: PollDetailsModel, activeCount) => async (dispatch) => {
  dispatch({ type: POLLS_UPDATE, poll, activeCount })
}

export const listPolls = () => async (dispatch) => {
  dispatch({ type: POLLS_LOAD })
  const dao = await contractsManagerDAO.getVotingManagerDAO()
  const [ count, activeCount, list ] = await Promise.all([
    dao.getPollsCount(),
    dao.getActivePollsCount(),
    dispatch(getNextPage()),
  ])
  dispatch({ type: VOTING_POLLS_COUNT, count, activeCount })
  dispatch({ type: POLLS_LIST, list })
}

export const getNextPage = () => async (dispatch, getState) => {
  const dao = await contractsManagerDAO.getVotingManagerDAO()
  const votingState = getState().get(DUCK_VOTING)
  return await dao.getPollsPaginated(votingState.lastPoll(), PAGE_SIZE)
}
