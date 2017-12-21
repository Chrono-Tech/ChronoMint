import contractsManagerDAO from 'dao/ContractsManagerDAO'
import PollNoticeModel, {
  IS_ACTIVATED, IS_CREATED, IS_ENDED, IS_REMOVED, IS_UPDATED,
  IS_VOTED,
} from 'models/notices/PollNoticeModel'
import TokenModel from 'models/tokens/TokenModel'
import PollModel from 'models/PollModel'
import ipfs from 'utils/IPFS'
import { MultiEventsHistoryABI, PollManagerABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

export const TX_CREATE_POLL = 'NewPoll'
export const TX_REMOVE_POLL = 'removePoll'
export const TX_ACTIVATE_POLL = 'activatePoll'
export const TX_ADMIN_END_POLL = 'adminEndPoll'

const EVENT_POLL_CREATED = 'PollCreated'
const EVENT_POLL_UPDATED = 'PollUpdated'
const EVENT_POLL_ACTIVATED = 'PollActivated'
const EVENT_POLL_DELETED = 'PollDeleted'
const EVENT_POLL_ENDED = 'PollEnded'
const EVENT_VOTE_CREATED = 'VoteCreated'

export default class VotingDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(PollManagerABI, at, MultiEventsHistoryABI)
  }

  async getVoteLimit (token: TokenModel) {
    const voteLimit = await this._call('getVoteLimit')
    return token.removeDecimals(voteLimit)
  }

  async createPoll (poll: PollModel, token: TokenModel) {
    // TODO @ipavlenko: It may be suitable to handle IPFS error and dispatch
    // a failure notice.
    const hash = await ipfs.put({
      title: poll.title(),
      description: poll.description(),
      files: poll.files() && poll.files(),
      options: poll.options() && poll.options().toArray(),
    })
    const voteLimitInTIME = poll.voteLimitInTIME()

    try {
      const tx = await this._tx(TX_CREATE_POLL, [
        // TODO @ipavlenko: There are no reasons to store options in contracts.
        // We can get them from the IPFS.
        poll.options() && poll.options().toArray().map((element, index) => `Option${index}`),
        // TODO @ipavlenko: There are no reasons to store files in contracts.
        // We can get them from the IPFS.
        [],
        this._c.ipfsHashToBytes32(hash),
        voteLimitInTIME && token.addDecimals(voteLimitInTIME),
        poll.deadline().getTime(),
      ], poll)
      return tx.tx
    } catch (e) {
      // eslint-disable-next-line
      console.log('createPoll', e)
    }
  }

  removePoll (id) {
    return this._tx(TX_REMOVE_POLL, [
      id,
    ])
  }

  activatePoll (pollId) {
    return this._multisigTx(TX_ACTIVATE_POLL, [
      pollId,
    ])
  }

  endPoll (pollId) {
    return this._multisigTx(TX_ADMIN_END_POLL, [
      pollId,
    ])
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

  async watchActivated (callback) {
    return this._watch(EVENT_POLL_ACTIVATED, this._watchCallback(callback, IS_ACTIVATED))
  }

  async watchEnded (callback) {
    return this._watch(EVENT_POLL_ENDED, this._watchCallback(callback, IS_ENDED))
  }

  async watchCreated (callback) {
    return this._watch(EVENT_POLL_CREATED, this._watchCallback(callback, IS_CREATED))
  }

  async watchUpdated (callback) {
    return this._watch(EVENT_POLL_UPDATED, this._watchCallback(callback, IS_UPDATED))
  }

  async watchRemoved (callback) {
    return this._watch(EVENT_POLL_DELETED, this._watchCallback(callback, IS_REMOVED))
  }

  async watchVoted (callback) {
    return this._watch(EVENT_VOTE_CREATED, this._watchCallback(callback, IS_VOTED))
  }
}
