import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import PollModel, { IS_CREATED, IS_REMOVED/*, IS_UPDATED*/ } from 'models/PollModel'
import PollNoticeModel from 'models/notices/PollNoticeModel'

export const TX_NEW_POLL = 'NewPoll'
export const TX_ACTIVATE_POLL = 'activatePoll'
export const TX_ADMIN_END_POLL = 'adminEndPoll'

const EVENT_POLL_CREATED = 'PollCreated'
const EVENT_POLL_DELETED = 'PollDeleted'
// const EVENT_POLL_UPDATED = 'PollUpdated' // TODO @ipavlenko: Replace

export default class VoteDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/PollManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  pollsCount () {
    return this._callNum('pollsCount')
  }

  createPoll (poll: PollModel) {
    return this._tx(TX_NEW_POLL, [
      ['One', 'Two'], // TODO @ipavlenko: poll.options
      [], // TODO @ipavlenko: implement documents, pass ipfsHashes array
      poll.title(),
      poll.description(),// || '',
      poll.voteLimit() || 10,// || 0,
      poll.deadline()// || new Date().getTime()
    ])
  }

  activatePoll (pollId) {
    return this._multisigTx(TX_ACTIVATE_POLL, [pollId])
  }

  /** @private */
  _watchCallback = (callback, status) => (result) => {
    console.log('VoteDAO Result: ', result, status, new PollNoticeModel())
    // callback(new PollNoticeModel(
    //   new PollModel({
    //     address: result.args.token,
    //     name: this._c.bytesToString(result.args.title),
    //     symbol: this._c.bytesToString(result.args.description),
    //     url: this._c.bytesToString(result.args.voteLimit),
    //     decimals: result.args.decimals.toNumber(),
    //     icon: this._c.bytes32ToIPFSHash(result.args.ipfsHash)
    //   }),
    //   status
    // ))
  }

  async watchCreated (callback) {
    return this._watch(EVENT_POLL_CREATED, this._watchCallback(callback, IS_CREATED))
  }

  async watchRemoved (callback) {
    return this._watch(EVENT_POLL_DELETED, this._watchCallback(callback, IS_REMOVED))
  }

  // async watchUpdated (callback) {
  //   return this._watch(EVENT_POLL_UPDATED, this._watchCallback(callback, IS_UPDATED))
  // }

  // TODO @dkchv: implement multisig
  // setVotesPercent() {
  // return this._multisigTx(...)
  // }
  //
  // adminEndPoll (pollId) {
  //   return this._multisigTx(TX_ADMIN_END_POLL, [pollId])
  // }
  //
  // addFilesToPoll (pollId, files: Array) {
  //   files = files.filter(f => f && f.length)
  //   return files.map(hash => this._tx('addIpfsHashToPoll', [pollId, hash]))
  // }

  // getPoll (index) {
  //   return this._call('polls', [index]).then(poll => {
  //     const promise0 = this._call('getOptionsVotesForPoll', [index])
  //     const promise1 = this._call('getOptionsForPoll', [index])
  //     const promise2 = this._call('getIpfsHashesFromPoll', [index])
  //     return Promise.all([promise0, promise1, promise2]).then((r) => {
  //       poll.options = r[0].map((votes, index) => new PollOptionModel({
  //         index,
  //         votes: votes.toNumber(),
  //         description: this._c.bytesToString(r[1][index])
  //       }))
  //       poll.files = r[2].map((hash, index) => ({index, hash}))
  //
  //       // const owner = poll[0];
  //       const pollTitle = this._c.bytesToString(poll[1])
  //       const pollDescription = this._c.bytesToString(poll[2])
  //       const voteLimit = poll[3].toNumber()
  //       // const optionsCount = poll[4]
  //       const deadline = poll[5].toNumber()
  //       const ongoing = poll[6]
  //       // const ipfsHashesCount = poll[7]
  //       const activated = poll[8]
  //       const options = poll.options
  //       const files = poll.files
  //       return new PollModel({
  //         index,
  //         pollTitle,
  //         pollDescription,
  //         voteLimit,
  //         deadline,
  //         options,
  //         files,
  //         activated,
  //         ongoing
  //       })
  //     })
  //   })
  // }

  // vote (pollKey, option) {
  //   return this._tx('vote', [pollKey, option])
  // }
  //
  // async newPollWatch (callback) {
  //   return this._watch('PollCreated', (result) => {
  //     callback(result.args._pollId.toNumber())
  //   })
  // }
  //
  // async newVoteWatch (callback) {
  //   return this._watch('VoteCreated', (result) => {
  //     callback(result.args._pollId.toNumber(), result.args._choice.toNumber())
  //   })
  // }

  // _decodeArgs (func, args) {
  //   return new Promise(resolve => {
  //     switch (func) {
  //       case TX_ACTIVATE_POLL:
  //         resolve({
  //           id: args._pollId
  //         }) // TODO
  //         break
  //       case TX_ADMIN_END_POLL:
  //         resolve({
  //           id: args._pollId
  //         }) // TODO
  //         break
  //
  //       default:
  //         resolve(args)
  //     }
  //   })
  // }
}
