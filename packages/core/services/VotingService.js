/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import PollEmitter from '../dao/PollEmitterDAO'

//#region CONSTANTS

import {
  EVENT_POLL_ACTIVATED,
  EVENT_POLL_CREATED,
  EVENT_POLL_ENDED,
  EVENT_POLL_REMOVED,
  EVENT_POLL_VOTED,
} from '../dao/constants/PollEmitterDAO'

//#endregion

class VotingService extends EventEmitter {

  constructor () {
    super(...arguments)
    this._cache = {}
  }

  getPollEmitterDAO (address) {
    if (!this._cache[address]) {
      const pollEmitter = new PollEmitter(address)
      pollEmitter.setVotingManagerDAO(this.getVotingManager())
      this._cache[address] = pollEmitter
    }
    return this._cache[address]
  }

  setVotingManager (VotingManagerDAO) {
    this._cache['VotingManager'] = VotingManagerDAO
  }

  getVotingManager () {
    if (!this._cache['VotingManager']) {
      throw Error('VotingManagerDAO is not found')
    }
    return this._cache['VotingManager']
  }

  subscribeToPoll (address, account) {
    if (this._cache[address]) {
      return null
    }

    const dao = this.getPollEmitterDAO(address)

    return Promise.all([
      dao.watchVoted((result) => {
        this.emit(EVENT_POLL_VOTED, result)
      }, {
        self: address,
      }, account),
      dao.watchActivated((result) => {
        this.emit(EVENT_POLL_ACTIVATED, result)
      }, {
        self: address,
      }),
      dao.watchEnded((result) => {
        this.emit(EVENT_POLL_ENDED, result)
      }, {
        self: address,
      }),
    ])
  }

  subscribeToVoting (account) {
    const dao = this.getVotingManager()

    return Promise.all([
      dao.watchCreated((result) => {
        this.emit(EVENT_POLL_CREATED, result)
      }, account),
      dao.watchRemoved((result) => {
        this.emit(EVENT_POLL_REMOVED, result)
      }),
    ])
  }
}

export default new VotingService()
