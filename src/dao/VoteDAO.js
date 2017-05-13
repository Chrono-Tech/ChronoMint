import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import PollModel from '../models/PollModel'
import PollOptionModel from '../models/PollOptionModel'

class VoteDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/Vote.json'), at, false)
  }

  pollsCount () {
    return this._call('pollsCount')
  }

  newPoll (pollTitle: string, pollDescription: string, voteLimit: number, deadline: number, options: Array) {
    options = options.filter(o => o && o.length)
    const optionsCount = options.length
    options = options.map(item => this._toBytes32(item))
    return this._tx('NewPoll', [options, this._toBytes32(pollTitle), this._toBytes32(pollDescription), voteLimit, optionsCount, deadline])
  }

  activatePoll (pollId) {
    return this._tx('activatePoll', [pollId])
  }

  adminEndPoll (pollId) {
    return this._tx('adminEndPoll', [pollId])
  }

  addFilesToPoll (pollId, files: Array) {
    files = files.filter(f => f && f.length)
    return files.map(hash => this._tx('addIpfsHashToPoll', [pollId, hash]))
  }

  getPoll (index) {
    return this._call('polls', [index]).then(poll => {
      const promise0 = this._call('getOptionsVotesForPoll', [index])
      const promise1 = this._call('getOptionsForPoll', [index])
      const promise2 = this._call('getIpfsHashesFromPoll', [index])
      return Promise.all([promise0, promise1, promise2]).then((r) => {
        poll.options = r[0].map((votes, index) => new PollOptionModel({
          index,
          votes: votes.toNumber(),
          description: this._bytesToString(r[1][index])
        }))
        poll.files = r[2].map((hash, index) => ({index, hash}))

        // const owner = poll[0];
        const pollTitle = this._bytesToString(poll[1])
        const pollDescription = this._bytesToString(poll[2])
        const voteLimit = poll[3].toNumber()
        // const optionsCount = poll[4]
        const deadline = poll[5].toNumber()
        const ongoing = poll[6]
        // const ipfsHashesCount = poll[7]
        const activated = poll[8]
        const options = poll.options
        const files = poll.files
        return new PollModel({
          index,
          pollTitle,
          pollDescription,
          voteLimit,
          deadline,
          options,
          files,
          activated,
          ongoing
        })
      })
    })
  }

  vote (pollKey, option) {
    return this._tx('vote', [pollKey, option])
  }

  newPollWatch (callback) {
    return this.contract.then(deployed => {
      let blockNumber = null
      this.web3.eth.getBlockNumber((e, r) => {
        blockNumber = r
        // eslint-disable-next-line
        deployed.New_Poll().watch((e, r) => {
          if (r.blockNumber > blockNumber) callback(r.args._pollId.toNumber())
        })
      })
    })
  }

  newVoteWatch (callback) {
    return this.contract.then(deployed => {
      let blockNumber = null
      this.web3.eth.getBlockNumber((e, r) => {
        blockNumber = r
        // eslint-disable-next-line
        deployed.NewVote().watch((e, r) => {
          if (r.blockNumber > blockNumber) callback(r.args._pollId.toNumber(), r.args._choice.toNumber())
        })
      })
    })
  }
}

export default new VoteDAO()
