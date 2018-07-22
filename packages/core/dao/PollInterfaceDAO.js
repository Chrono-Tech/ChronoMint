/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import Amount from '../models/Amount'
import AbstractContractDAO from '../refactor/daos/lib/AbstractContractDAO'

export const TX_ACTIVATE_POLL = 'activatePoll'
export const TX_VOTE = 'vote'
export const TX_REMOVE_POLL = 'killPoll'
export const TX_END_POLL = 'endPoll'

export default class PollInterfaceDAO extends AbstractContractDAO  {
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
    let votes = new Immutable.Map()
    options.map((option, i) => {
      const value = new BigNumber(values[i])
      if (!value.isZero()) {
        votes = votes.set(option.toString(), new Amount(value || 0, 'TIME'))
      }
    })
    return votes
  }

  async activatePoll (options) {
    const txOptions = { useDefaultGasLimit: true, ...options }

    const tx = await this._tx(TX_ACTIVATE_POLL, [], new BigNumber(0), new BigNumber(0), txOptions)
    return tx
  }

  vote (choice, choiceText, options) {
    return this._tx(TX_VOTE, [choice + 1], new BigNumber(0), new BigNumber(0), { choice: choiceText.option, ...options }) // choice +1, because in SC, numbering starts from 1
  }

  async removePoll (options) {
    const txOptions = { allowNoReturn: true, useDefaultGasLimit: true, ...options }

    const tx = await this._tx(TX_REMOVE_POLL, [], new BigNumber(0), new BigNumber(0), txOptions)
    return tx
  }

  async endPoll (options) {
    const txOptions = { useDefaultGasLimit: true, ...options }

    const tx = await this._tx(TX_END_POLL, [], new BigNumber(0), new BigNumber(0), txOptions)
    return tx
  }

}
