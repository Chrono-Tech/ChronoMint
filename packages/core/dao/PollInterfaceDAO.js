/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import Amount from '../models/Amount'
import { TIME } from '../redux/mainWallet/actions'
import { MultiEventsHistoryABI, PollInterfaceABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

export const TX_ACTIVATE_POLL = 'activatePoll'
export const TX_VOTE = 'vote'
export const TX_REMOVE_POLL = 'killPoll'
export const TX_END_POLL = 'endPoll'

export default class PollInterfaceDAO extends AbstractMultisigContractDAO {
  constructor ({ web3, history }) {
    super()
    this.history = history
    this.web3 = web3
    // eslint-disable-next-line no-console
    console.log('[PollInterfaceManagerDAO] Created')
  }

  hasMember (address: string): boolean {
    if (!address) {
      return false
    }
    return this._call('hasMember', [address])
  }

  memberOption (address: string) {
    if (!address) {
      return false
    }
    return this._call('memberOptions', [address])
  }

  getDetails () {
    return this._call('getDetails')
  }

  async getVotesBalances () {
    const [options, values] = await this._call('getVotesBalances') // [Array(options), Array(values)]
    let votes = new Immutable.Map()
    options.map((option, i) => {
      if (!values[i].isZero()) {
        votes = votes.set(option.toString(), new Amount(values[i] || 0, TIME))
      }
    })
    return votes
  }

  activatePoll () {
    return this._multisigTx(TX_ACTIVATE_POLL, [], null, {
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
