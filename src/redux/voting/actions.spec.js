import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import { store } from 'specsInit'

import PollModel from 'models/PollModel'
// import type PollDetailsModel from 'models/PollDetailsModel'
import PollNoticeModel, { IS_CREATED, IS_REMOVED, IS_ACTIVATED, IS_ENDED, IS_VOTED } from 'models/notices/PollNoticeModel'

import { createPoll, removePoll, activatePoll, endPoll, vote } from './actions'
import contractsManagerDAO from 'dao/ContractsManagerDAO'

const poll1 = {
  proto: new PollModel({
    title: 'First poll',
    description: 'First poll description',
    voteLimit: new BigNumber(1),
  }),
  details: null,
}

const poll2 = {
  proto: new PollModel({
    title: 'Second poll',
    description: 'Second poll description',
    options: new Immutable.List(['First', 'Second']),
  }),
  details: null,
}

describe('Voting actions', () => {
  it('should create poll1', async done => {
    const dao = await contractsManagerDAO.getVotingDAO()
    await store.dispatch(createPoll(poll1.proto))
    await dao.watchCreated((notice: PollNoticeModel) => {
      try {
        expect(notice.status()).toEqual(IS_CREATED)
        const details = notice.poll()
        const poll = details.poll()
        expect(poll.title()).toEqual(poll1.proto.title())
        expect(poll.description()).toEqual(poll1.proto.description())
        expect(poll.voteLimitInTIME()).toEqual(poll1.proto.voteLimitInTIME())
        poll1.details = details
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })

  it('should create poll2', async done => {
    const dao = await contractsManagerDAO.getVotingDAO()
    await store.dispatch(createPoll(poll2.proto))
    await dao.watchCreated((notice: PollNoticeModel) => {
      try {
        expect(notice.status()).toEqual(IS_CREATED)
        const details = notice.poll()
        const poll = details.poll()
        expect(poll.title()).toEqual(poll2.proto.title())
        expect(poll.description()).toEqual(poll2.proto.description())
        poll2.details = details
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })

  it('should remove poll1', async done => {
    const dao = await contractsManagerDAO.getVotingDAO()
    await store.dispatch(removePoll(poll1.details))
    await dao.watchRemoved((notice: PollNoticeModel) => {
      try {
        expect(notice.status()).toEqual(IS_REMOVED)
        expect(notice.pollId()).toEqual(poll1.details.poll().id())
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })

  it('should activate poll2', async done => {
    const dao = await contractsManagerDAO.getVotingDAO()
    await store.dispatch(activatePoll(poll2.details))
    await dao.watchActivated((notice: PollNoticeModel) => {
      try {
        expect(notice.status()).toEqual(IS_ACTIVATED)
        expect(notice.pollId()).toEqual(poll2.details.poll().id())
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })

  // TODO @ipavlenko: Find a way to get account with deposited tokens
  // (do not sure if I forced to use wallet actions manually)
  it.skip('should vote for poll2', async done => {
    const dao = await contractsManagerDAO.getVotingDAO()
    await store.dispatch(vote(poll2.details, 1))
    await dao.watchVoted((notice: PollNoticeModel) => {
      try {
        expect(notice.status()).toEqual(IS_VOTED)
        expect(notice.pollId()).toEqual(poll2.details.poll().id())
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })

  it('should end poll2', async done => {
    const dao = await contractsManagerDAO.getVotingDAO()
    await store.dispatch(endPoll(poll2.details))
    await dao.watchEnded((notice: PollNoticeModel) => {
      try {
        expect(notice.status()).toEqual(IS_ENDED)
        expect(notice.pollId()).toEqual(poll2.details.poll().id())
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })
})
