import AbstractContractDAO from './AbstractContractDAO'
import { VoteActorABI, MultiEventsHistoryABI } from './abi'

export const TX_VOTE = 'vote'

export default class VotingActorDAO extends AbstractContractDAO {
  constructor (at) {
    super(VoteActorABI, at, MultiEventsHistoryABI)
  }

  vote (pollId, choice) {
    return this._tx(TX_VOTE, [pollId, choice])
  }
}
