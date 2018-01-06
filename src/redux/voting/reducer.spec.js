import BigNumber from 'bignumber.js'
import VotingCollection from 'models/voting/VotingCollection'
import PollModel from 'models/PollModel'
import PollDetailsModel from 'models/PollDetailsModel'
import * as a from './actions'
import reducer from './reducer'

const initialState = new VotingCollection()
const poll = new PollDetailsModel({
  poll: new PollModel()
    .set('id', 1)
    .set('published', null)
    .set('deadline', null),
})

describe('assetsManager reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('sould POLLS_INIT', () => {
    expect(
      reducer(undefined, {
        type: a.POLLS_INIT,
        isInited: true,
      }),
    ).toMatchSnapshot()
  })

  it('sould handle POLLS_VOTE_LIMIT', () => {
    expect(
      reducer(undefined, {
        type: a.POLLS_VOTE_LIMIT,
        voteLimitInTIME: new BigNumber(1),
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
        list: new VotingCollection(),
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

  it('sould handle POLLS_REMOVE_STUB', () => {
    expect(
      reducer(undefined, {
        type: a.POLLS_REMOVE_STUB,
        transactionHash: 'test',
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
    expect(
      reducer(undefined, {
        type: a.POLLS_REMOVE,
        item: new PollModel().set('id', 1),
      }),
    ).toMatchSnapshot()
  })

})
