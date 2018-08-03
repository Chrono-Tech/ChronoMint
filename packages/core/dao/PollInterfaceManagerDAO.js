/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import PollInterfaceDAO from './PollInterfaceDAO'
import { PollInterfaceABI } from './abi'

export default class PollInterfaceManagerDAO extends EventEmitter {
  constructor ({ web3, history, subscribeTxFlow }) {
    super()
    this.history = history
    this.web3 = web3
    this.subscribe = subscribeTxFlow // subscribe to Tx flow

    // eslint-disable-next-line no-console
    console.log('[PollInterfaceManagerDAO] Created')
  }

  async getPollInterfaceDAO (address: String) {
    const pollInterfaceDao = new PollInterfaceDAO({ abi: PollInterfaceABI, address, history: this.history })
    pollInterfaceDao.connect(this.web3)
    this.subscribe(pollInterfaceDao)

    return pollInterfaceDao
  }
}
