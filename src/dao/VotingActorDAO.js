import contractsManagerDAO from 'dao/ContractsManagerDAO'
import PollNoticeModel, { IS_VOTED } from 'models/notices/PollNoticeModel'
import { MultiEventsHistoryABI, VoteActorABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export const TX_VOTE = 'vote'
const EVENT_VOTE_CREATED = 'VoteCreated'

export default class VotingActorDAO extends AbstractContractDAO {
  constructor (at) {
    super(VoteActorABI, at, MultiEventsHistoryABI)
  }

  vote (pollId, choice) {
    return this._tx(TX_VOTE, [ pollId, choice ])
  }

  /** @private */
  _watchCallback = (callback, status) => async (result) => {
    // eslint-disable-next-line
    console.log('--VotingDAO#', result)
    const detailsDAO = await contractsManagerDAO.getVotingDetailsDAO()
    const poll = await detailsDAO.getPollDetails(result.args.pollId)
    callback(new PollNoticeModel({
      pollId: result.args.pollId.toNumber(), // just a long
      poll,
      status,
      transactionHash: result.transactionHash,
    }))
  }

  async watchVoted (callback) {
    return this._watch(EVENT_VOTE_CREATED, this._watchCallback(callback, IS_VOTED))
  }
}
