/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PollNoticeModel, { IS_VOTED, IS_ACTIVATED, IS_ENDED } from '../models/notices/PollNoticeModel'
import { MultiEventsHistoryABI, PollEmitterABI } from './abi'
import AbstractContractDAO from './AbstractContract3DAO'

export const EVENT_POLL_VOTED = 'PollVoted'
export const EVENT_POLL_ACTIVATED = 'PollActivated'
export const EVENT_POLL_ENDED = 'PollEnded'

export default class PollEmitterDAO extends AbstractContractDAO {
  constructor (at) {
    super(PollEmitterABI, at, MultiEventsHistoryABI)

    this.votingManagerDAO = null
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleAllEventsData)
  }

  disconnect () {
    if (this.isConnected) {
      this.allEventsEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  setVotingManagerDAO = (dao) => {
    this.votingManagerDAO = dao
  }

  handleAllEventsData = (data) => {
    if (!data.event) {
      return null
    }
    console.log('handleAllEventsData: ', data)
    this.emit(data.event, data)
  }

  /** @private */
  _watchCallback = (callback, status, account: string) => async (result) => {

    const poll = await this.votingManagerDAO.getPoll(result.args.self, account)

    callback(new PollNoticeModel({
      pollId: result.args.self, // just a long
      poll,
      status,
      transactionHash: result.transactionHash,
    }))
  }

  async watchVoted (callback, filter, account) {
    return this.on(EVENT_POLL_VOTED, this._watchCallback(callback, IS_VOTED, account), filter)
  }

  async watchActivated (callback, filter) {
    return this.on(EVENT_POLL_ACTIVATED, this._watchCallback(callback, IS_ACTIVATED), filter)
  }

  async watchEnded (callback, filter) {
    return this.on(EVENT_POLL_ENDED, this._watchCallback(callback, IS_ENDED), filter)
  }
}
