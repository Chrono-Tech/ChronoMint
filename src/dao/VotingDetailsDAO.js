// import BigNumber from 'bignumber.js'
import ipfs from 'utils/IPFS'
import Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import PollModel from 'models/PollModel'
import PollDetailsModel from 'models/PollDetailsModel'
// import contractsManagerDAO from './ContractsManagerDAO'
// import resultCodes from 'chronobank-smart-contracts/common/errors'

export default class VotingDetailsDAO extends AbstractContractDAO {

  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/PollDetails.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  async getPolls () {
    const [activeIds, inactiveIds] = await Promise.all([
      await this.getActivePollIds(),
      await this.getInactivePollIds()
    ])
    return await Promise.all(
      [...activeIds, ...inactiveIds].map(id => this.getPollDetails(id))
    )
  }

  async getActivePollIds () {
    const ids = await this._call('getActivePolls')
    return ids.map(id => id.toNumber())
  }

  async getInactivePollIds () {
    const ids = await this._call('getInactivePolls')
    return ids.map(id => id.toNumber())
  }

  async getPoll (pollId): PollDetailsModel {
    try {
      const [ id, owner, hashBytes, voteLimit, deadline, status, active ] = await this._call('getPoll', [pollId])
      const hash = this._c.bytes32ToIPFSHash(hashBytes)
      const { title, description, published, options, files } = await ipfs.get(hash)
      return new PollModel({
        id: id.toNumber(),
        owner,
        hash,
        title,
        description,
        voteLimit: voteLimit && voteLimit.toNumber(), // voteLimit is just a long
        deadline: deadline && new Date(deadline.toNumber()), // deadline is just a timestamp
        published: published && new Date(published),
        status,
        active,
        options: new Immutable.List(options || []),
        files: new Immutable.List(files || [])
      })
    } catch (e) {
      console.log(e)
      // ignore, poll doesn't exist
      return null
    }
  }

  async getPollDetails (pollId): PollDetailsModel {
    const [ poll, votes ] = await Promise.all([
      this.getPoll(pollId),
      this._call('getOptionsVotesForPoll', [pollId])
    ])
    return poll && new PollDetailsModel({
      poll,
      votes
    })
  }
}
