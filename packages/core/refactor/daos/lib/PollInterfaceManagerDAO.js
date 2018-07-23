/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import PollInterfaceDAO from '../../../../core/dao/PollInterfaceDAO'
import { PollInterfaceABI } from '../../../../core/dao/abi'

export default class PollInterfaceManagerDAO extends EventEmitter {
  constructor ({ web3, history }) {
    super()
    this.history = history
    this.web3 = web3
    // eslint-disable-next-line no-console
    console.log('[PollInterfaceManagerDAO] Created')
  }

  async getPollInterfaceDAO (address: String) {
    const pollInterfaceDao = new PollInterfaceDAO({ abi: PollInterfaceABI, address, history: this.history })
    pollInterfaceDao.connect(this.web3)

    return pollInterfaceDao
  }
}
