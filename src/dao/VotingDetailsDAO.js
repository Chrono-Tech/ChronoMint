// import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import PollModel from 'models/PollModel'
import PollDetailsModel from 'models/PollDetailsModel'
// import contractsManagerDAO from './ContractsManagerDAO'
// import resultCodes from 'chronobank-smart-contracts/common/errors'

export default class VotingDetailsDAO extends AbstractContractDAO {

  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/PollDetails.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  pollsCount () {
    return this._callNum('pollsCount')
  }

  async getPoll (pollId): PollDetailsModel {
    const poll = await this._call('getPoll', [pollId])
    return new PollModel({
      index: pollId,
      owner: poll[0],
      title: this._c.bytesToString(poll[1]),
      description: this._c.bytesToString(poll[2]),
      voteLimit: poll[3] && poll[3].toNumber(), // just a long
      deadline: poll[4] && new Date(poll[4].toNumber()), // just a timestamp
      status: poll[5],
      active: poll[6],
      options: new Immutable.List((poll[7] || []).map((b) => this._c.bytesToString(b))),
      hashes: new Immutable.List(poll[8] || [])
    })
  }

  async getPollDetails (pollId): PollDetailsModel {
    const [ poll, votes ] = await Promise.all([
      this.getPoll(pollId),
      this._call('getOptionsVotesForPoll', [pollId])
    ])
    return new PollDetailsModel({
      poll,
      votes
    })
  }
}
