/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'

export class ETHDAO extends EventEmitter {
  connect (web3) {
    if (this.isConnected) {
      this.disconnect()
    }
    this.web3 = web3
    this.logsEmitter = this.web3.eth.subscribe('newBlockHeaders', function(error, result) {
    if (!error)
        console.log(result)
    else console.log(error)
    })
      .on('data', this.handleBlockData.bind(this))
      .on('error', this.handleBlockError.bind(this))
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

  async handleBlockData (data) {
    // eslint-disable-next-line no-console
    console.log('[ETHDAO] Block received', data)
    const block = await this.web3.eth.getBlock(data.hash, true)
    setImmediate(() => {
      this.emit('block', block)
      if (block && block.transactions) {
        for (const tx of block.transactions) {
          this.emit('tx', tx)
        }
      }
    })
  }

  handleBlockError (error) {
    // eslint-disable-next-line no-console
    console.error('[ETHTokenDAO] Error in Transfer event subscription', error)
  }
}

export default new ETHDAO()
