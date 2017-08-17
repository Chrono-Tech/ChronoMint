import ipfs from 'utils/IPFS'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'

import PollModel from 'models/PollModel'
import PollNoticeModel, { IS_CREATED, IS_UPDATED, IS_REMOVED, IS_ACTIVATED, IS_ENDED, IS_VOTED } from 'models/notices/PollNoticeModel'

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
    super(
      require('chronobank-smart-contracts/build/contracts/PollManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  async createPoll (poll: PollModel) {
    // TODO @ipavlenko: It may be suitable to handle IPFS error and dispatch
    // a failure notice.
    const hash = await ipfs.put({
      title: poll.title(),
      description: poll.description(),
      // TODO @ipavlenko: Better to set and store time in contracts,
      // but there is no such ability for awhile.
      // published: new Date().getTime(),
      published: new Date('2017-08-10').getTime(),
      files: poll.files() && poll.files().toArray(),
      options: poll.options() && poll.options().toArray(),
    })
    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    await this._tx(TX_CREATE_POLL, [
      // TODO @ipavlenko: There are no reasons to store options in contracts.
      // We can get them from the IPFS.
      poll.options() && poll.options().toArray().map((element, index) => `Option${index}`),
      // TODO @ipavlenko: There are no reasons to store files in contracts.
      // We can get them from the IPFS.
      poll.files() && poll.files().toArray().map((element, index) => `File${index}`),
      this._c.ipfsHashToBytes32(hash),
      poll.voteLimit() === null
        ? null
        : timeDAO.addDecimals(poll.voteLimit()),
      poll.deadline().getTime()
    ])
    // TODO @ipavlenko: Better to have an ID in the response here and return
    // persisted PollModel. Think about returning from the contract both error
    // code and persisted ID.
  }

  removePoll (id) {
    return this._tx(TX_REMOVE_POLL, [
      id
    ])
  }

  activatePoll (pollId) {
    return this._multisigTx(TX_ACTIVATE_POLL, [
      pollId
    ])
  }

  endPoll (pollId) {
    return this._multisigTx(TX_ADMIN_END_POLL, [
      pollId
    ])
  }

  /** @private */
  _watchCallback = (callback, status) => async (result) => {
    const detailsDAO = await contractsManagerDAO.getVotingDetailsDAO()
    const poll = await detailsDAO.getPollDetails(result.args.pollId)
    callback(
      new PollNoticeModel({
        pollId: result.args.pollId.toNumber(), // just a long
        poll,
        status
      })
    )
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
