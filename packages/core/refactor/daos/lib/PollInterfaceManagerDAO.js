/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import { PollInterfaceABI } from './abi'

export default class ContractsManagerDAO extends EventEmitter {
  constructor (web3) {
    super()

    this.web3 = web3
  }

  disconnect () {
    if (this.isConnected) {
      // eslint-disable-next-line no-console
      console.log('[ContractsManagerDAO] Disconnect')
      this.contract = null
      this.web3 = null
    }
  }

  async getPollInterfaceDAO (pollId) {
    // todo create pollInterfaceDAO from pollId
  }

  async isExists (address: String) {
    return this.contract.methods.isExists(address).call()
  }
}
