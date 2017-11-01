import contractsManagerDAO from 'dao/ContractsManagerDAO'

import PollModel from 'models/PollModel'
import PollNoticeModel, { IS_CREATED, IS_UPDATED, IS_REMOVED, IS_ACTIVATED, IS_ENDED, IS_VOTED } from 'models/notices/PollNoticeModel'

import ipfs from 'utils/IPFS'

import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

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
    this._voteLimit = null
    this.initMetaData()
  }

  async initMetaData () {
    const voteLimit = await this._call('getVoteLimit')
    this.setVoteLimit(voteLimit)
  }

  setVoteLimit (voteLimit: string) {
    this._voteLimit = voteLimit
  }

  getVoteLimit () {
    return this._voteLimit
  }

  async createPoll (poll: PollModel) {
    // TODO @ipavlenko: It may be suitable to handle IPFS error and dispatch
    // a failure notice.
    const hash = await ipfs.put({
      title: poll.title(),
      description: poll.description(),
      files: poll.files() && poll.files(),
      options: poll.options() && poll.options().toArray(),
    })
    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    const voteLimitInTIME = poll.voteLimitInTIME()

    const tx = await this._tx(TX_CREATE_POLL, [
      // TODO @ipavlenko: There are no reasons to store options in contracts.
      // We can get them from the IPFS.
      poll.options() && poll.options().toArray().map((element, index) => `Option${index}`),
      // TODO @ipavlenko: There are no reasons to store files in contracts.
      // We can get them from the IPFS.
      [],
      this._c.ipfsHashToBytes32(hash),
      voteLimitInTIME && timeDAO.addDecimals(voteLimitInTIME),
      poll.deadline().getTime(),
    ], poll)
    return tx.tx
    // TODO @ipavlenko: Better to have an ID in the response here and return
    // persisted PollModel. Think about returning from the contract both error
    // code and persisted ID.
  }

  removePoll (id) {
    return this._tx(TX_REMOVE_POLL, [
      id,
    ])
  }

  activatePoll (pollId) {
    return this._multisigTx(TX_ACTIVATE_POLL, [
      pollId,
    ])
  }

  endPoll (pollId) {
    return this._multisigTx(TX_ADMIN_END_POLL, [
      pollId,
    ])
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
