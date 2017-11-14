import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import FileModel from 'models/FileSelect/FileModel'
import PollDetailsModel from 'models/PollDetailsModel'
import PollModel from 'models/PollModel'
import ipfs from 'utils/IPFS'
import { MultiEventsHistoryABI, PollDetailsABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'
import contractsManagerDAO from './ContractsManagerDAO'

export default class VotingDetailsDAO extends AbstractContractDAO {
  constructor (at) {
    super(PollDetailsABI, at, MultiEventsHistoryABI)
  }

  async getPolls () {
    const [activeIds, inactiveIds] = await Promise.all([
      await this.getActivePollIds(),
      await this.getInactivePollIds(),
    ])
    return await Promise.all([...activeIds, ...inactiveIds].map((id) => this.getPollDetails(id)))
  }

  async getActivePollIds () {
    const ids = await this._call('getActivePolls')
    return ids.map((id) => id.toNumber())
  }

  async getInactivePollIds () {
    const ids = await this._call('getInactivePolls')
    return ids.map((id) => id.toNumber())
  }

  async getPoll (pollId): PollDetailsModel {
    try {
      const [response, timeDAO] = await Promise.all([
        this._call('getPoll', [pollId]),
        await contractsManagerDAO.getTIMEDAO(),
      ])
      const [id, owner, hashBytes, voteLimit, deadline, status, active, published] = response

      const hash = this._c.bytes32ToIPFSHash(hashBytes)
      const {
        title, description, options, files,
      } = await ipfs.get(hash)
      return new PollModel({
        id: id.toNumber(),
        owner,
        hash,
        title,
        description,
        voteLimitInTIME: voteLimit.equals(new BigNumber(0)) ? null : timeDAO.removeDecimals(voteLimit),
        deadline: deadline.toNumber() ? new Date(deadline.toNumber()) : null, // deadline is just a timestamp
        published: published.toNumber() ? new Date(published.toNumber() * 1000) : null, // published is just a timestamp
        status,
        active,
        options: new Immutable.List(options || []),
        files,
      })
    } catch (e) {
      // ignore, poll doesn't exist
      return null
    }
  }

  async getPollDetails (pollId): PollDetailsModel {
    const [poll, votes, statistics, memberVote, timeDAO, timeHolderDAO] = await Promise.all([
      this.getPoll(pollId),
      this._call('getOptionsVotesForPoll', [pollId]),
      this._call('getOptionsVotesStatisticForPoll', [pollId]),
      this._call('getMemberVotesForPoll', [pollId]),
      await contractsManagerDAO.getTIMEDAO(),
      await contractsManagerDAO.getTIMEHolderDAO(),
    ])
    const totalSupply = await timeDAO.totalSupply()
    const shareholdersCount = await timeHolderDAO.shareholdersCount()
    const files = poll && await ipfs.get(poll.files())

    return poll && new PollDetailsModel({
      poll,
      votes,
      statistics,
      memberVote: memberVote && memberVote.toNumber(), // just an option index
      timeDAO,
      totalSupply,
      shareholdersCount,
      files: new Immutable.List((files && files.links || [])
        .map((item) => FileModel.createFromLink(item))),
    })
  }
}
