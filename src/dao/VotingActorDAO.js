import MultiEventsHistoryABI from 'chronobank-smart-contracts/build/contracts/MultiEventsHistory.json'
import VoteActorABI from 'chronobank-smart-contracts/build/contracts/VoteActor.json'
import AbstractContractDAO from './AbstractContractDAO'

export const TX_VOTE = 'vote'

export default class VotingActorDAO extends AbstractContractDAO {
  constructor (at) {
    super(VoteActorABI, at, MultiEventsHistoryABI)
  }

  vote (pollId, choice) {
    return this._tx(TX_VOTE, [pollId, choice])
  }
}
