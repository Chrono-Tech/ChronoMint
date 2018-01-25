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
import PollDetailsModel from 'models/PollDetailsModel'
import FileModel from 'models/FileSelect/FileModel'
import VotingCollection from 'models/voting/VotingCollection'
import TokenModel from 'models/tokens/TokenModel'
import { MultiEventsHistoryABI, VotingManagerABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

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

  async getVoteLimit () {
    return await this._call('getVoteLimit')
  }

  async getPollsPaginated (startIndex, pageSize, account: string) {
    const addresses = await this._call('getPollsPaginated', [ startIndex, pageSize ])
    return await this.getPollsDetails(addresses.filter((address) => !this.isEmptyAddress(address)), account)
  }

  async createPoll (poll: PollModel, timeToken: TokenModel) {
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

    const summary = poll.txSummary()
    summary.voteLimit = timeToken.removeDecimals(voteLimitInTIME)

    const tx = await this._tx(TX_CREATE_POLL, [
      poll.options().size,
      this._c.ipfsHashToBytes32(hash),
      voteLimitInTIME,
      poll.deadline().getTime(),
    ], summary)
    return tx.tx
  }

  removePoll () {
    return this._tx(TX_REMOVE_POLL)
  }

  activatePoll () {
    return this._multisigTx(TX_ACTIVATE_POLL)
  }

  async getPollsDetails (pollsAddresses: Array<string>, account: string) {
    let result = new VotingCollection()
    try {
      const [ pollsDetails, assetHolderDAO ] = await Promise.all([
        await this._call('getPollsDetails', [ pollsAddresses ]),
        await contractsManagerDAO.getAssetHolderDAO(),
      ])

      const [ owners, bytesHashes, voteLimits, deadlines, statuses, activeStatuses, publishedDates ] = pollsDetails
      const shareholdersCount = await assetHolderDAO.shareholdersCount()

      for (let i = 0; i < pollsAddresses.length; i++) {
        try {
          const pollId = pollsAddresses[ i ]

          try {
            votingService.subscribeToPoll(pollId, account)
          } catch (e) {
            // eslint-disable-next-line
            console.error('watch error', e.message)
          }

          const pollInterface = await contractsManagerDAO.getPollInterfaceDAO(pollId)
          const [ votes, hasMember, memberOption ] = await Promise.all([
            await pollInterface.getVotesBalances(),
            await pollInterface.hasMember(account),
            await pollInterface.memberOption(account),
          ])

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
            hasMember,
            memberOption,
          })
          const pollFiles = poll && await ipfs.get(poll.files())

          result = result.add(new PollDetailsModel({
            id: pollId,
            poll,
            votes,
            shareholdersCount,
            files: new Immutable.List((pollFiles && pollFiles.links || [])
              .map((item) => FileModel.createFromLink(item))),
          }).isFetched(true))
        } catch (e) {
          // eslint-disable-next-line
          console.error(e.message)
        }
      }

    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message)
    }

    return result
  }

  async getPoll (pollId: string, account: string): PollDetailsModel {
    const votingManagerDAO = await contractsManagerDAO.getVotingManagerDAO()
    const polls = await votingManagerDAO.getPollsDetails([ pollId ], account)
    return polls.item(pollId)
  }

  /** @private */
  _watchCallback = (callback, status, account: string) => async (result) => {
    let notice = new PollNoticeModel({
      pollId: result.args.pollAddress, // just a long
      status,
      transactionHash: result.transactionHash,
    })

    if (status !== IS_REMOVED) {
      const poll = await this.getPoll(result.args.pollAddress, account)
      notice = notice.poll(poll)
    }

    callback(notice)
  }

  async watchCreated (callback, account) {
    return this._watch(EVENT_POLL_CREATED, this._watchCallback(callback, IS_CREATED, account))
  }

  async watchUpdated (callback) {
    return this._watch(EVENT_POLL_UPDATED, this._watchCallback(callback, IS_UPDATED))
  }

  async watchRemoved (callback) {
    return this._watch(EVENT_POLL_REMOVED, this._watchCallback(callback, IS_REMOVED))
  }
}
