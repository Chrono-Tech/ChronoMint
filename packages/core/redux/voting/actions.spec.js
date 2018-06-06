/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PollEmitter from 'dao/PollEmitterDAO'
import tokenService from 'services/TokenService'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import Immutable from 'immutable'
import { accounts, mockStore } from 'specsInit'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import PollModel from 'models/PollModel'
import PollNoticeModel, { IS_ACTIVATED, IS_CREATED, IS_ENDED, IS_REMOVED, IS_VOTED, } from 'models/notices/PollNoticeModel'
import ERC20ManagerDAO, { EVENT_NEW_ERC20_TOKEN } from 'dao/ERC20ManagerDAO'
import TokenModel from 'models/tokens/TokenModel'
import TokensCollection from 'models/tokens/TokensCollection'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import VotingMainModel from 'models/voting/VotingMainModel'
import {
  activatePoll,
  createPoll,
  DUCK_VOTING,
  endPoll,
  listPolls,
  POLLS_CREATE,
  POLLS_LIST,
  POLLS_LOAD,
  POLLS_REMOVE,
  POLLS_UPDATE,
  POLLS_VOTE_LIMIT,
  removePoll,
  updateVoteLimit,
  vote,
  watchPoll,
} from './actions'

const poll1 = {
  proto: new PollModel({
    title: 'First poll',
    description: 'First poll description',
    voteLimitInTIME: new BigNumber(1),
    options: new Immutable.List([ 'option1', 'option2' ]),
    deadline: moment().add(1, 'day').toDate(),
  }),
  details: null,
}

const poll2 = {
  proto: new PollModel({
    title: 'Second poll',
    description: 'Second poll description',
    voteLimitInTIME: new BigNumber(1),
    options: new Immutable.List([ 'First', 'Second' ]),
    deadline: moment().add(1, 'day').toDate(),
  }),
  details: null,
}

let store
let tokens = new TokensCollection()
const mock = new Immutable.Map({
  [ DUCK_SESSION ]: {
    account: accounts[ 0 ],
  },
  [ DUCK_TOKENS ]: tokens,
  [ DUCK_VOTING ]: new VotingMainModel(),
})

describe('Voting actions', () => {
  afterEach(async (done) => {
    await setTimeout(() => {
      done()
    }, 3000)
  })
  it('init Time', async (done) => {
    const erc20: ERC20ManagerDAO = await contractsManagerDAO.getERC20ManagerDAO()
    erc20
      .on(EVENT_NEW_ERC20_TOKEN, async (token: TokenModel) => {
        if (token.symbol() === 'TIME') {
          tokenService.createDAO(token)
          tokens = tokens.add(token)
          store = mockStore(mock.set(DUCK_TOKENS, tokens))
          done()
        }
      })
      .fetchTokens()
  })

  it('should create poll1', async (done) => {
    await store.dispatch(createPoll(poll1.proto))
    const dao = await contractsManagerDAO.getVotingManagerDAO()
    await dao.watchCreated((notice: PollNoticeModel) => {
      try {
        expect(notice.status()).toEqual(IS_CREATED)
        const details = notice.poll()
        const poll = details.poll()
        expect(poll.title()).toEqual(poll1.proto.title())
        expect(poll.description()).toEqual(poll1.proto.description())
        expect(poll.voteLimitInTIME().toNumber()).toEqual(poll1.proto.voteLimitInTIME().toNumber())
        poll1.details = details
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })

  it('should create poll2', async (done) => {
    const dao = await contractsManagerDAO.getVotingManagerDAO()
    await store.dispatch(createPoll(poll2.proto))
    await dao.watchCreated((notice: PollNoticeModel) => {
      try {
        expect(notice.status()).toEqual(IS_CREATED)
        const details = notice.poll()
        const poll = details.poll()
        expect(poll.title()).toEqual(poll2.proto.title())
        expect(poll.description()).toEqual(poll2.proto.description())
        expect(poll.voteLimitInTIME().toNumber()).toEqual(poll2.proto.voteLimitInTIME().toNumber())
        poll2.details = details
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })

  it('should check listPolls', async () => {
    store.clearActions()
    await store.dispatch(listPolls())
    const actions = store.getActions()

    expect(actions[ 0 ].type).toEqual(POLLS_LOAD)
    expect(actions[ 1 ].type).toEqual(POLLS_LIST)
    expect(actions[ 1 ].list.size() > 0).toBeTruthy()
  })

  it.skip('should remove poll1', async (done) => {
    const dao = await contractsManagerDAO.getVotingManagerDAO()
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

  it('should activate poll2', async (done) => {
    const pollEmitter = new PollEmitter(poll2.details.poll().id())
    await store.dispatch(activatePoll(poll2.details))
    await pollEmitter.watchActivated((notice: PollNoticeModel) => {
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
  it.skip('should vote for poll2', async (done) => {
    const dao = new PollEmitter(poll2.details.poll().id())
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

  it('should end poll2', async (done) => {
    const dao = new PollEmitter(poll2.details.poll().id())
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

  it('should check watchPoll', async () => {
    let actions

    store.clearActions()
    store.dispatch(watchPoll(new PollNoticeModel({
      status: IS_CREATED,
      poll: new PollModel(),
    })))
    actions = store.getActions()
    expect(actions[ 0 ].type).toEqual(POLLS_REMOVE)
    expect(actions[ 1 ].type).toEqual(POLLS_CREATE)

    store.clearActions()
    store.dispatch(watchPoll(new PollNoticeModel({
      status: IS_REMOVED,
    })))
    actions = store.getActions()
    expect(actions[ 0 ].type).toEqual(POLLS_REMOVE)

    store.clearActions()
    store.dispatch(watchPoll(new PollNoticeModel({
      status: IS_ACTIVATED,
    })))
    actions = store.getActions()
    expect(actions[ 0 ].type).toEqual(POLLS_UPDATE)

    store.clearActions()
    store.dispatch(watchPoll(new PollNoticeModel({
      status: IS_ENDED,
    })))
    actions = store.getActions()
    expect(actions[ 0 ].type).toEqual(POLLS_UPDATE)

    store.clearActions()
    store.dispatch(watchPoll(new PollNoticeModel({
      status: IS_VOTED,
    })))
    actions = store.getActions()
    expect(actions[ 0 ].type).toEqual(POLLS_UPDATE)
  })

  it('should check updateVoteLimit', async () => {
    store.clearActions()
    await store.dispatch(updateVoteLimit())
    const actions = store.getActions()

    expect(actions[ 0 ].type).toEqual(POLLS_VOTE_LIMIT)
    expect(actions[ 0 ].voteLimitInTIME.gt(0)).toBeTruthy()
    expect(actions[ 0 ].voteLimitInPercent.gt(0)).toBeTruthy()
  })

})
