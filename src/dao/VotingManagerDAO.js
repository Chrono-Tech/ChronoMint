import votingService from 'services/VotingService'
import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import PollNoticeModel, {
  IS_CREATED,
  IS_REMOVED,
  IS_UPDATED,
} from 'models/notices/PollNoticeModel'
import PollModel from 'models/PollModel'
import ipfs from 'utils/IPFS'
import { MultiEventsHistoryABI, VotingManagerABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import PollDetailsModel from '../models/PollDetailsModel'
import FileModel from '../models/FileSelect/FileModel'
import VotingCollection from '../models/voting/VotingCollection'

export const TX_CREATE_POLL = 'createPoll'
export const TX_REMOVE_POLL = 'removePoll'
export const TX_ACTIVATE_POLL = 'activatePoll'

export const EVENT_POLL_CREATED = 'PollCreated'
export const EVENT_POLL_UPDATED = 'PollUpdated'
export const EVENT_POLL_REMOVED = 'PollRemoved'

export default class VotingManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(VotingManagerABI, at, MultiEventsHistoryABI)
  }

  async getPollsCount () {
    return await this._call('getPollsCount')
  }

  async getVoteLimit () {
    return await this._call('getVoteLimit')
  }

  async getActivePollsCount () {
    return await this._call('getActivePollsCount')
  }

  async getPollsPaginated (startIndex, pageSize) {
    // eslint-disable-next-line
    console.log('getPollsPaginated', [ startIndex, pageSize ])
    const addresses = await this._call('getPollsPaginated', [ startIndex, pageSize ])
    return await this.getPollsDetails(addresses.filter((address) => !this.isEmptyAddress(address)))
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

    const voteLimitInTIME = poll.voteLimitInTIME()
    const options = poll.options() && poll.options().toArray().map((element, index) => `Option${index}`)

    const tx = await this._tx(TX_CREATE_POLL, [
      options,
      [],
      this._c.ipfsHashToBytes32(hash),
      voteLimitInTIME,
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

  async getPollsDetails (pollsAddresses: Array<string>) {
    // eslint-disable-next-line
    console.log('getPollsDetails pollsAddresses', pollsAddresses)
    try {
      const [ owners, bytesHashes, voteLimits, deadlines, statuses, activeStatuses, publishedDates ] = await this._call('getPollsDetails', [ pollsAddresses ])

      let result = new VotingCollection()
      for (let i = 0; i < pollsAddresses.length; i++) {
        try {
          const pollId = pollsAddresses[ i ]

          try {
            votingService.subscribeToPoll(pollId)
          } catch (e) {
            // eslint-disable-next-line
            console.error('watch error', e.message)
          }

          const pollInterface = await contractsManagerDAO.getPollInterfaceDAO(pollId)
          const votes = await pollInterface.getVotesBalances()
          const hash = this._c.bytes32ToIPFSHash(bytesHashes[ i ])
          const { title, description, options, files } = await ipfs.get(hash)
          const poll = new PollModel({
            id: pollId,
            owner: owners[ i ],
            hash,
            votes,
            title,
            description,
            voteLimitInTIME: voteLimits[ i ].equals(new BigNumber(0)) ? null : voteLimits[ i ],
            deadline: deadlines[ i ].toNumber() ? new Date(deadlines[ i ].toNumber()) : null, // deadline is just a timestamp
            published: publishedDates[ i ].toNumber() ? new Date(publishedDates[ i ].toNumber() * 1000) : null, // published is just a timestamp
            status: statuses[ i ],
            active: activeStatuses[ i ],
            options: new Immutable.List(options || []),
            files,
          })
          const pollFiles = poll && await ipfs.get(poll.files())

          result = result.add(new PollDetailsModel({
            id: pollId,
            poll,
            votes,
            // statistics,
            // memberVote: memberVote && memberVote.toNumber(), // just an option index
            files: new Immutable.List((pollFiles && pollFiles.links || [])
              .map((item) => FileModel.createFromLink(item))),
          }))
        } catch (e) {
          // eslint-disable-next-line
          console.error(e.message)
        }
      }

      return result

    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message)
      // ignore, poll doesn't exist
      return null
    }
  }

  async getPoll (pollId): PollDetailsModel {
    const [ polls ] = await Promise.all([
      this.getPollsDetails([ pollId ]),
    ])

    return polls[ pollId ]
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

  async watchUpdated (callback) {
    return this._watch(EVENT_POLL_UPDATED, this._watchCallback(callback, IS_UPDATED))
  }

  async watchRemoved (callback) {
    return this._watch(EVENT_POLL_REMOVED, this._watchCallback(callback, IS_REMOVED))
  }
}
