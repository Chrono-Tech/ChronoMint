import contractsManagerDAO from 'dao/ContractsManagerDAO'
import PollNoticeModel, {
  IS_ACTIVATED,
  IS_CREATED,
  IS_ENDED,
  IS_REMOVED,
  IS_UPDATED,
  IS_VOTED,
} from 'models/notices/PollNoticeModel'
import PollModel from 'models/PollModel'
import ipfs from 'utils/IPFS'
import { VotingManagerABI, MultiEventsHistoryABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

export const TX_CREATE_POLL = 'createPoll'
export const TX_REMOVE_POLL = 'removePoll'
export const TX_ACTIVATE_POLL = 'activatePoll'
export const TX_ADMIN_END_POLL = 'adminEndPoll'

const EVENT_POLL_CREATED = 'PollCreated'
const EVENT_POLL_UPDATED = 'PollUpdated'
const EVENT_POLL_ACTIVATED = 'PollActivated'
const EVENT_POLL_DELETED = 'PollDeleted'
const EVENT_POLL_ENDED = 'PollEnded'
const EVENT_VOTE_CREATED = 'VoteCreated'

export default class VotingManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(VotingManagerABI, at, MultiEventsHistoryABI)
    // eslint-disable-next-line
    console.log(VotingManagerABI)
  }

  async getPollsCount () {
    return await this._call('getPollsCount')
  }

  async getVoteLimit () {
    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    const voteLimit = await this._call('getVoteLimit')
    return timeDAO.removeDecimals(voteLimit)
  }

  async getActivePollsCount () {
    return await this._call('getActivePollsCount')
  }

  async getPollsPaginated (startIndex, pageSize) {
    const addresses = await this._call('getPollsPaginated', [startIndex, pageSize])
    // eslint-disable-next-line
    console.log(addresses)
  }

  vote () {

  }

  async createPoll (poll: PollModel) {
    // TODO @ipavlenko: It may be suitable to handle IPFS error and dispatch
    // a failure notice.
    let hash
    try {
      hash = await ipfs.put({
        title: poll.title(),
        description: poll.description(),
        files: poll.files() && poll.files(),
        options: poll.options() && poll.options().toArray(),
      })
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message)
    }

    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    const voteLimitInTIME = poll.voteLimitInTIME()
    const options = poll.options() && poll.options().toArray().map((element, index) => `Option${index}`)

    const tx = await this._tx(TX_CREATE_POLL, [
      options,
      [],
      this._c.ipfsHashToBytes32(hash),
      voteLimitInTIME && timeDAO.addDecimals(voteLimitInTIME),
      poll.deadline().getTime(),
    ], poll)
    return tx.tx
  }

  removePoll () {
    return this._tx(TX_REMOVE_POLL)
  }

  activatePoll () {
    return this._multisigTx(TX_ACTIVATE_POLL)
  }

  endPoll () {
    return this._multisigTx(TX_ADMIN_END_POLL)
  }

  getPollsDetails (pollsAddresses: Array<string>) {

  }

  /** @private */
  _watchCallback = (callback, status) => async (result) => {
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
