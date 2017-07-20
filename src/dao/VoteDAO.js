import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import PollModel from '../models/PollModel'
import PollOptionModel from '../models/PollOptionModel'

export const TX_ACTIVATE_POLL = 'activatePoll'
export const TX_ADMIN_END_POLL = 'adminEndPoll'

export default class VoteDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/Vote.json'), at)
  }

  pollsCount () {
    return this._callNum('pollsCount')
  }

  newPoll (pollTitle: string, pollDescription: string, voteLimit: number, deadline: number, options: Array) {
    options = options.filter(o => o && o.length)
    const optionsCount = options.length
    options = options.map(item => this._c.toBytes32(item))
    return this._tx('NewPoll', [
      options,
      this._c.toBytes32(pollTitle),
      this._c.toBytes32(pollDescription),
      voteLimit,
      optionsCount,
      deadline
    ])
  }

  // TODO @dkchv: implement multisig
  // setVotesPercent() {
  // return this._multisigTx(...)
  // }

  activatePoll (pollId) {
    return this._multisigTx(TX_ACTIVATE_POLL, [pollId])
  }

  adminEndPoll (pollId) {
    return this._multisigTx(TX_ADMIN_END_POLL, [pollId])
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
          description: this._c.bytesToString(r[1][index])
        }))
        poll.files = r[2].map((hash, index) => ({index, hash}))

        // const owner = poll[0];
        const pollTitle = this._c.bytesToString(poll[1])
        const pollDescription = this._c.bytesToString(poll[2])
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

  async newPollWatch (callback) {
    return this._watch('PollCreated', (result) => {
      callback(result.args._pollId.toNumber())
    })
  }

  async newVoteWatch (callback) {
    return this._watch('VoteCreated', (result) => {
      callback(result.args._pollId.toNumber(), result.args._choice.toNumber())
    })
  }

  _decodeArgs (func, args) {
    return new Promise(resolve => {
      switch (func) {
        case TX_ACTIVATE_POLL:
          resolve({
            id: args._pollId
          }) // TODO
          break
        case TX_ADMIN_END_POLL:
          resolve({
            id: args._pollId
          }) // TODO
          break

        default:
          resolve(args)
      }
    })
  }
}
