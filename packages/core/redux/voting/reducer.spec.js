/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import VotingCollection from '../../models/voting/VotingCollection'
import PollModel from '../../models/PollModel'
import PollDetailsModel from '../../models/PollDetailsModel'
import VotingMainModel from '../../models/voting/VotingMainModel'
import * as a from './actions'
import reducer from './reducer'

const initialState = new VotingMainModel()
const poll = new PollDetailsModel({
  poll: new PollModel()
    .set('id', 1)
    .set('published', null)
    .set('deadline', null),
})
let votingsList = new VotingCollection()
votingsList = votingsList.add(poll)

describe('assetsManager reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('sould POLLS_VOTE_LIMIT', () => {
    expect(
      reducer(undefined, {
        type: a.POLLS_VOTE_LIMIT,
        voteLimitInTIME: new BigNumber(1),
        voteLimitInPercent: new BigNumber(1),
      }),
    ).toMatchSnapshot()
  })

  it('sould handle POLLS_LOAD', () => {
    expect(
      reducer(undefined, {
        type: a.POLLS_LOAD,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle POLLS_LIST', () => {
    expect(
      reducer(undefined, {
        type: a.POLLS_LIST,
        list: votingsList,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle POLLS_CREATE', () => {
    expect(
      reducer(undefined, {
        type: a.POLLS_CREATE,
        poll,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle POLLS_UPDATE', () => {
    expect(
      reducer(undefined, {
        type: a.POLLS_UPDATE,
        poll,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle POLLS_REMOVE', () => {
    const state = initialState.list(votingsList)
    expect(
      reducer(state, {
        type: a.POLLS_REMOVE,
        id: '1',
      }),
    ).toMatchSnapshot()
  })

})
