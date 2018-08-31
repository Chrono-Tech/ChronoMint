/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import votingService from '../../services/VotingService'
import type PollNoticeModel from '../../models/notices/PollNoticeModel'
import PollDetailsModel from '../../models/PollDetailsModel'
import { notify } from '../notifier/actions'
import { PTPoll } from './types'
import { getSelectedPollFromDuck, getVoting, getPolls, getLastVoting } from './selectors/models'
import { daoByType } from '../daos/selectors'
import PollModel from '../../models/PollModel'

import {
  DUCK_SESSION,
} from '../session/constants'
import {
  IS_ACTIVATED,
  IS_CREATED,
  IS_ENDED,
  IS_REMOVED,
  IS_UPDATED,
  IS_VOTED,
} from '../../models/constants/PollNoticeModel'
import {
  EVENT_POLL_ACTIVATED,
  EVENT_POLL_CREATED,
  EVENT_POLL_ENDED,
  EVENT_POLL_REMOVED,
  EVENT_POLL_VOTED,
} from '../../dao/constants/PollEmitterDAO'
import { executeTransaction } from '../ethereum/thunks'
import * as VotingActions from './actions'
import { registerDao } from '../daos/actions'
import ContractDAOModel from '../../models/contracts/ContractDAOModel'
import ContractModel from '../../models/contracts/ContractModel'

const PAGE_SIZE = 20

export const selectPoll = (id) => (dispatch) =>
  dispatch(VotingActions.handlePollSelected(id))

export const watchPoll = (notice: PollNoticeModel) => async (dispatch) => {
  switch (notice.status()) {
    case IS_CREATED: {
      dispatch(VotingActions.handlePollRemoved(notice.transactionHash()))
      const noticePoll = notice.poll()
      if (noticePoll) {
        dispatch(VotingActions.handlePollCreated(noticePoll))
      }
      break
    }
    case IS_REMOVED:
      dispatch(VotingActions.handlePollRemoved(notice.pollId()))
      break
    case IS_ACTIVATED:
    case IS_ENDED:
    case IS_VOTED:
    case IS_UPDATED: {
      const noticePoll = notice.poll()
      if (noticePoll) {
        dispatch(VotingActions.handlePollCreated(noticePoll))
      }
      break
    }
  }
  dispatch(notify(notice))
}

export const updateVoteLimit = () => async (dispatch, getState) => {
  const state = getState()
  const votingDAO = daoByType('VotingManager')(state)
  const [voteLimitInTIME, percentVoteLimit] = await Promise.all([
    votingDAO.getVoteLimit(),
    votingDAO.getVoteLimitInPercent(),
  ])
  const voteLimitInPercent = new BigNumber(percentVoteLimit).div(100)
  dispatch(VotingActions.setPollVoteLimit(voteLimitInTIME, voteLimitInPercent))
}

export const watchInitPolls = () => async (dispatch, getState) => {
  const state = getState()
  const callback = (notice) => dispatch(watchPoll(notice))
  const { account } = state.get(DUCK_SESSION)
  const votingManagerDAO = daoByType('VotingManager')(state)
  votingService
    .setVotingManager(votingManagerDAO)
  votingService
    .subscribeToVoting(account)

  votingService
    .on('newPollDao', async (emitterDao) => {
      const dao = await votingManagerDAO.pollInterfaceManagerDAO.getPollInterfaceDAO(emitterDao.address)
      dispatch(registerDao(new ContractDAOModel({
        contract: new ContractModel({
          abi: dao.abi,
          type: `${dao.getContractName()}-${dao.address}`,
        }),
        address: dao.address,
        dao,
      })))
    })
    .on(EVENT_POLL_CREATED, callback)
    .on(EVENT_POLL_REMOVED, callback)
    .on(EVENT_POLL_ACTIVATED, callback)
    .on(EVENT_POLL_ENDED, callback)
    .on(EVENT_POLL_VOTED, callback)

  return Promise.all([
    dispatch(updateVoteLimit()),
  ])
}

export const createPoll = (poll: PollDetailsModel) => async (dispatch, getState) => {
  const state = getState()
  const votingDAO = daoByType('VotingManager')(state)

  try {
    const tx = await votingDAO.createPoll(poll.poll)
    if (tx) {
      dispatch(executeTransaction({ tx }))
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('createPoll error: ', e)
  }
}

export const removePoll = (pollObject: PTPoll) => async (dispatch, getState) => {
  const state = getState()
  const votingDAO = daoByType('VotingManager')(state)

  const poll = pollObject && pollObject.id
    ? getVoting(state).list().item(pollObject.id)
    : getSelectedPollFromDuck(state)

  try {
    dispatch(VotingActions.handlePollRemoved(poll.id))
    const dao = await votingDAO.pollInterfaceManagerDAO.getPollInterfaceDAO(poll.id)

    const tx = dao.removePoll()
    if (tx) {
      dispatch(executeTransaction({ tx }))
    }

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('removePoll error: ', e)
    dispatch(VotingActions.handlePollCreated(poll))
    throw e
  }
}

export const vote = (choice: number) => async (dispatch, getState) => {
  const state = getState()
  const poll = getSelectedPollFromDuck(state)
  const votingDAO = daoByType('VotingManager')(state)

  try {
    dispatch(VotingActions.handlePollUpdated(new PollDetailsModel({ ...poll, isFetching: true })))
    const dao = await votingDAO.pollInterfaceManagerDAO.getPollInterfaceDAO(poll.id)
    const tx = dao.vote(choice)
    if (tx) {
      dispatch(executeTransaction({ tx }))
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Vote poll error: ', e)
    dispatch(VotingActions.handlePollUpdated(poll))
    throw e
  }
}

export const activatePoll = (pollObject: PTPoll) => async (dispatch, getState) => {
  const state = getState()
  const votingDAO = daoByType('VotingManager')(state)
  const poll = pollObject && pollObject.id
    ? getVoting(state).list().item(pollObject.id)
    : getSelectedPollFromDuck(state)

  try {
    dispatch(VotingActions.handlePollUpdated(poll.mutate({ poll: new PollModel({ ...poll.poll, active: true, isFetching: true }) })))

    const dao = await votingDAO.pollInterfaceManagerDAO.getPollInterfaceDAO(poll.id)
    const tx = dao.activatePoll({ symbol: 'TIME' })
    if (tx) {
      dispatch(executeTransaction({ tx }))
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Active poll error: ', e)
    dispatch(VotingActions.handlePollUpdated(poll))
  }
}

export const endPoll = (pollObject: PTPoll) => async (dispatch, getState) => {
  const state = getState()
  const poll = getPolls(state).item(pollObject.id)
  const votingDAO = daoByType('VotingManager')(state)

  try {
    dispatch(VotingActions.handlePollUpdated(
      poll
        .mutate({
          poll: poll.poll.mutate({
            active: false,
            status: false,
            isFetching: true,
          }),
        }),
    ))
    const dao = await votingDAO.pollInterfaceManagerDAO.getPollInterfaceDAO(poll.id)
    const tx = dao.endPoll()
    if (tx) {
      dispatch(executeTransaction({ tx }))
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('End poll error: ', e)
    dispatch(VotingActions.handlePollUpdated(poll))
  }
}

export const listPolls = () => async (dispatch) => {
  dispatch(VotingActions.pollsLoad())
  const list = await dispatch(getNextPage())
  dispatch(VotingActions.pollsList(list))
}

// FIXME: OMG, pagination via DAO!
export const getNextPage = () => async (dispatch, getState) => {
  const state = getState()
  const dao = daoByType('VotingManager')(state)
  const { account } = state.get(DUCK_SESSION)

  return dao.getPollsPaginated(getLastVoting(state), PAGE_SIZE, account)
}
