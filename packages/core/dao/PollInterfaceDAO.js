/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Map } from 'immutable'
import BigNumber from 'bignumber.js'
import Amount from '../models/Amount'
import AbstractContractDAO from './AbstractContractDAO'

//#region CONSTANTS

import {
  TX_ACTIVATE_POLL,
  TX_END_POLL,
  TX_REMOVE_POLL,
  TX_VOTE,
} from './constants/PollInterfaceDAO'

//#endregion CONSTANTS

export default class PollInterfaceDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  hasMember (address: string): boolean {
    if (!address) {
      return false
    }
    return this.contract.methods.hasMember(address).call()
  }

  memberOption (address: string) {
    if (!address) {
      return false
    }
    return this.contract.methods.memberOptions(address).call()
  }

  getDetails () {
    return this.contract.methods.getDetails().call()
  }

  async getVotesBalances () {
    const result = await this.contract.methods.getVotesBalances().call()
    const [options, values] = [result[0], result[1]] // [Array(options), Array(values)]
    let votes = new Map()
    options.map((option, i) => {
      const value = new BigNumber(values[i])
      if (!value.isZero()) {
        votes = votes.set(option.toString(), new Amount(value || 0, 'TIME'))
      }
    })
    return votes
  }

  activatePoll () {
    return this._tx(TX_ACTIVATE_POLL, [])
  }

  vote (choice) {
    return this._tx(TX_VOTE, [choice + 1])
  }

  removePoll () {
    return this._tx(TX_REMOVE_POLL, [])
  }

  endPoll () {
    return this._tx(TX_END_POLL, [])
  }

}
