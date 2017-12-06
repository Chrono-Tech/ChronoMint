import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
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
import { MultiEventsHistoryABI, VotingManagerABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import PollDetailsModel from '../models/PollDetailsModel'
import FileModel from '../models/FileSelect/FileModel'

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

  async getPollsDetails (pollsAddresses: Array<string>) {
    try {
      const [response, timeDAO] = await Promise.all([
        this._call('getPollsDetails', [pollsAddresses]),
        await contractsManagerDAO.getTIMEDAO(),
      ])
      const [owners, bytesHashes, voteLimits, deadlines, statuses, activeStatuses, publishedDates] = response

      let result = {}
      for (let i = 0; i < pollsAddresses.length; i++) {
        const pollId = pollsAddresses[i]
        const hash = this._c.bytes32ToIPFSHash(bytesHashes[i])
        const { title, description, options, files } = await ipfs.get(hash)

        result[pollId] = new PollModel({
          id: pollId,
          owner: owners[i],
          hash,
          title: title,
          description: description[i],
          voteLimitInTIME: voteLimits[i].equals(new BigNumber(0)) ? null : timeDAO.removeDecimals(voteLimits[i]),
          deadline: deadlines[i].toNumber() ? new Date(deadlines[i].toNumber()) : null, // deadline is just a timestamp
          published: publishedDates[i].toNumber() ? new Date(publishedDates[i].toNumber() * 1000) : null, // published is just a timestamp
          status: statuses[i],
          active: activeStatuses[i],
          options: new Immutable.List(options || []),
          files,
        })
      }

      return result

    } catch (e) {
      // ignore, poll doesn't exist
      return null
    }
  }

  async getPoll (pollId): PollDetailsModel {
    const [polls, timeDAO, timeHolderDAO] = await Promise.all([
      this.getPollsDetails([pollId]),
      await contractsManagerDAO.getTIMEDAO(),
      await contractsManagerDAO.getTIMEHolderDAO(),
    ])
    const poll = polls[pollId]
    const totalSupply = await timeDAO.totalSupply()
    const shareholdersCount = await timeHolderDAO.shareholdersCount()
    const files = poll && await ipfs.get(poll.files())

    return poll && new PollDetailsModel({
      poll,
      timeDAO,
      totalSupply,
      shareholdersCount,
      files: new Immutable.List((files && files.links || [])
        .map((item) => FileModel.createFromLink(item))),
    })
  }

  /** @private */
  _watchCallback = (callback, status) => async (result) => {
    const poll = await this.getPoll(result.args.pollAddress)

    callback(new PollNoticeModel({
      pollId: result.args.pollAddress, // just a long
      poll,
      status,
      transactionHash: result.transactionHash,
    }))
  }

  async watchCreated (callback) {
    return this._watch(EVENT_POLL_CREATED, this._watchCallback(callback, IS_CREATED))
  }

  async watchActivated (callback) {
    return this._watch(EVENT_POLL_ACTIVATED, this._watchCallback(callback, IS_ACTIVATED))
  }

  async watchEnded (callback) {
    return this._watch(EVENT_POLL_ENDED, this._watchCallback(callback, IS_ENDED))
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
