/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { push } from '@chronobank/core-dependencies/router'
import Amount from '../../models/Amount'
import { ETH } from '../../redux/mainWallet/actions'
import { DUCK_SESSION } from '../session/actions'
import votingService from '../../services/VotingService'
import contractsManagerDAO from '../../dao/ContractsManagerDAO'
import { EVENT_POLL_ACTIVATED, EVENT_POLL_ENDED, EVENT_POLL_VOTED } from '../../dao/PollEmitterDAO'
import type PollNoticeModel from '../../models/notices/PollNoticeModel'
import { IS_ACTIVATED, IS_CREATED, IS_ENDED, IS_REMOVED, IS_UPDATED, IS_VOTED } from '../../models/notices/PollNoticeModel'
import PollDetailsModel from '../../models/PollDetailsModel'
import { notify } from '../notifier/actions'
import { EVENT_POLL_CREATED, EVENT_POLL_REMOVED, TX_CREATE_POLL } from '../../dao/VotingManagerDAO'
import { PTPoll } from './types'
import { getSelectedPollFromDuck, getVoting } from './selectors/models'
import { daoByType } from '../../refactor/redux/daos/selectors'

export const POLLS_VOTE_LIMIT = 'voting/POLLS_LIMIT'
export const POLLS_LOAD = 'voting/POLLS_LOAD'
export const POLLS_LIST = 'voting/POLLS_LIST'
export const POLLS_CREATE = 'voting/POLLS_CREATE'
export const POLLS_REMOVE = 'voting/POLLS_REMOVE'
export const POLLS_UPDATE = 'voting/POLLS_UPDATE'
export const POLLS_SELECTED = 'voting/POLLS_SELECTED'

export const DUCK_VOTING = 'voting'
const PAGE_SIZE = 20

// used to create unique ID for fetching models
let counter = 1

export const goToVoting = () => (dispatch) => dispatch(push('/voting'))

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

export const updateVoteLimit = () => async (dispatch, getState) => {
  // const votingDAO = await contractsManagerDAO.getVotingManagerDAO()
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

export const createPoll = (poll: PollDetailsModel) => async (dispatch) => {
  const id = `stub_${--counter}`
  const stub = poll.id(id).isFetching(true)

  try {
    dispatch(handlePollCreated(stub))
    dispatch(goToVoting())
    const dao = await contractsManagerDAO.getVotingManagerDAO()
    const transactionHash = await dao.createPoll(poll.poll())
    dispatch(handlePollRemoved(stub.id()))
    dispatch(handlePollUpdated(stub.transactionHash(transactionHash)))
  } catch (e) {
    dispatch(handlePollRemoved(stub.id()))
  }
}

export const removePoll = (pollObject: PTPoll) => async (dispatch, getState) => {
  const state = getState()
  let poll = pollObject && pollObject.id
    ? getVoting(state).list().item(pollObject.id)
    : getSelectedPollFromDuck(state)
  try {
    dispatch(handlePollRemoved(poll.id()))
    dispatch(goToVoting())
    const dao = await contractsManagerDAO.getPollInterfaceDAO(poll.id())
    await dao.removePoll()
  } catch (e) {
    dispatch(handlePollCreated(poll))
    throw e
  }
}

export const vote = (choice: Number) => async (dispatch, getState) => {
  const poll = getSelectedPollFromDuck(getState())
  try {
    dispatch(handlePollUpdated(poll.isFetching(true)))
    const options = poll.voteEntries()
    const dao = await contractsManagerDAO.getPollInterfaceDAO(poll.id())
    await dao.vote(choice, options.get(choice))
  } catch (e) {
    dispatch(handlePollUpdated(poll))
    throw e
  }
}

export const activatePoll = (pollObject: PTPoll) => async (dispatch, getState) => {
  const state = getState()
  let poll = pollObject && pollObject.id
    ? getVoting(state).list().item(pollObject.id)
    : getSelectedPollFromDuck(state)
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

export const endPoll = (pollObject: PTPoll) => async (dispatch, getState) => {
  const poll = getState().get(DUCK_VOTING).list().item(pollObject.id)
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
  const dao = daoByType('VotingManager')(getState())

  const votingState = getState().get(DUCK_VOTING)
  const { account } = getState().get(DUCK_SESSION)
  return dao.getPollsPaginated(votingState.lastPoll(), PAGE_SIZE, account)
}

export const estimateGasForVoting = async (mode: string, params, callback, gasPriceMultiplier = 1) => {
  let dao = null
  switch (mode) {
    case TX_CREATE_POLL:
      dao = await contractsManagerDAO.getVotingManagerDAO()
      break
  }
  try {
    if (!dao) {
      callback(new Error('Dao is undefined'))
    }
    const { gasLimit, gasFee, gasPrice } = await dao.estimateGas(...params)
    callback(null, {
      gasLimit,
      gasFee: new Amount(gasFee.mul(gasPriceMultiplier), ETH),
      gasPrice: new Amount(gasPrice.mul(gasPriceMultiplier), ETH),
    })
  } catch (e) {
    callback(e)
  }
}
