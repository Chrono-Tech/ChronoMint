// import BigNumber from 'bignumber.js'
// import Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
// import PollModel from 'models/PollModel'
// import PollDetailsModel from 'models/PollDetailsModel'

export const TX_VOTE = 'vote'

export default class VotingActorDAO extends AbstractContractDAO {
  constructor(at) {
    super(
      require('chronobank-smart-contracts/build/contracts/VoteActor.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  vote(pollId, choice) {
    return this._tx(TX_VOTE, [pollId, choice])
  }
}
