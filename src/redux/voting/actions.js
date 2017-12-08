import votingService from 'services/VotingService'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { EVENT_POLL_ACTIVATED, EVENT_POLL_ENDED, EVENT_POLL_VOTED } from 'dao/PollBackendDAO'
import type PollNoticeModel from 'models/notices/PollNoticeModel'
import { IS_ACTIVATED, IS_CREATED, IS_ENDED, IS_REMOVED, IS_UPDATED, IS_VOTED } from 'models/notices/PollNoticeModel'
import PollDetailsModel from 'models/PollDetailsModel'
import PollModel from 'models/PollModel'
import { notify } from 'redux/notifier/actions'
import {
  POLLS_CREATE,
  POLLS_LIST,
  POLLS_LOAD,
  POLLS_REMOVE,
  POLLS_REMOVE_STUB,
  POLLS_UPDATE,
  POLLS_VOTE_LIMIT,
  VOTING_POLLS_COUNT,
} from 'redux/voting/reducer'
import { EVENT_POLL_CREATED, EVENT_POLL_REMOVED } from 'dao/VotingManagerDAO'

export const DUCK_VOTING = 'voting'
const PAGE_SIZE = 20

// used to create unique ID for fetching models
let counter = 0

export const watchPoll = (notice: PollNoticeModel) => async (dispatch, getState) => {
  const state = getState().get(DUCK_VOTING)
  // eslint-disable-next-line
  console.log(notice)
  switch (notice.status()) {
    case IS_CREATED:
      dispatch(handlePollRemovedStub(notice.transactionHash()))
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

export const createPoll = (poll: PollModel) => async (dispatch) => {
  const timeDAO = await contractsManagerDAO.getTIMEDAO()
  const stub = new PollDetailsModel({
    poll: poll.set('id', --counter),
    timeDAO,
  })
  try {
    dispatch(handlePollCreated(stub.isFetching(true)))
    const dao = await contractsManagerDAO.getVotingManagerDAO()
    const transactionHash = await dao.createPoll(poll)
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
  // const dao = await contractsManagerDAO.getVotingManagerDAO()
  // await dao.updatePoll(poll)
}

export const removePoll = (poll: PollDetailsModel) => async (dispatch) => {
  try {
    dispatch(handlePollRemoved(poll.poll().id()))
    const dao = await contractsManagerDAO.getPollInterfaceDAO(poll.poll().id())
    await dao.removePoll()
  } catch (e) {
    dispatch(handlePollCreated(poll))
    throw e
  }
}

export const vote = (poll: PollDetailsModel, choice: Number) => async (dispatch) => {
  try {
    dispatch(handlePollUpdated(poll.isFetching(true)))
    const dao = await contractsManagerDAO.getPollInterfaceDAO(poll.poll().id())
    await dao.vote(choice)
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
    const dao = await contractsManagerDAO.getPollInterfaceDAO(poll.poll().id())
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
    const dao = await contractsManagerDAO.getPollInterfaceDAO(poll.poll().id())
    await dao.endPoll()
  } catch (e) {
    dispatch(handlePollUpdated(poll))
  }
}

export const handlePollCreated = (poll: PollDetailsModel) => async (dispatch) => {
  dispatch({ type: POLLS_CREATE, poll })
}

export const handlePollRemoved = (id: Number) => async (dispatch) => {
  dispatch({ type: POLLS_REMOVE, id })
}

export const handlePollRemovedStub = (transactionHash: String) => async (dispatch) => {
  dispatch({ type: POLLS_REMOVE_STUB, transactionHash })
}

export const handlePollUpdated = (poll: PollDetailsModel, activeCount) => async (dispatch) => {
  dispatch({ type: POLLS_UPDATE, poll, activeCount })
}

export const listPolls = () => async (dispatch) => {
  dispatch({ type: POLLS_LOAD })
  const dao = await contractsManagerDAO.getVotingManagerDAO()
  const [count, activeCount, list] = await Promise.all([
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
