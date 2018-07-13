/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import Amount from '../models/Amount'
import { PollInterfaceABI } from '../../core/dao/abi'
import AbstractContractDAO from '../refactor/daos/lib/AbstractContractDAO'

export const TX_ACTIVATE_POLL = 'activatePoll'
export const TX_VOTE = 'vote'
export const TX_REMOVE_POLL = 'killPoll'
export const TX_END_POLL = 'endPoll'

export default class PollInterfaceDAO  {
  constructor ({ web3, address, history }) {
    // super()
    this.history = history
    this.address = address
    // eslint-disable-next-line no-console
    console.log('[PollInterfaceDAO] Created')

    this.contract = new web3.eth.Contract(PollInterfaceABI.abi, this.address)
  }

  connect () {
    if (this.isConnected) {
      this.disconnect()
    }
  }

  disconnect () {
    if (this.isConnected) {
      this.logsEmitter.removeAllListeners()
      this.logsEmitter = null
      this.web3 = null
    }
  }

  get isConnected () {
    return this.web3 != null // nil check
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

  activatePoll () {
    return this._tx(TX_ACTIVATE_POLL, [], null, new BigNumber(0), {
      useDefaultGasLimit: true,
    })
  }

  vote (choice, choiceText) {
    return this._tx(TX_VOTE, [choice + 1], { choice: choiceText.option }) // choice +1, because in SC, numbering starts from 1
  }

  removePoll () {
    return this._tx(TX_REMOVE_POLL, [], null, new BigNumber(0), {
      allowNoReturn: true,
      useDefaultGasLimit: true,
    }) // allow no return (since there would be a selfdestruct call)
  }

  endPoll () {
    return this._multisigTx(TX_END_POLL, [], null, {
      useDefaultGasLimit: true,
    })
  }

}
