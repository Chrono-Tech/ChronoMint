/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'
import EventEmitter from 'events'

export default class MetamaskPlugin extends EventEmitter {
  get name () {
    return 'metamask'
  }

  get title () {
    return 'Metamask Plugin'
  }

  get isConnected () {
    return !!this.web3
  }

  async init () {
    if (window.web3 && window.web3.currentProvider) {
      const web3 = new Web3(window.web3.currentProvider)
      const accounts = await web3.eth.getAccounts()
      if (accounts.length) {
        this.web3 = web3
        this.address = accounts[0]
        this.emit('connected')
      }
    }
  }

  async getAddressInfoList () {
    if (this.isConnected) {
      const accounts = await this.web3.eth.getAccounts()
      return accounts.map((address) => ({
        address,
        type: this.name,
      }))
    }

    return []
  }

  async signTransaction ({ gas, gasPrice, ...txData }) {
    const signed = await this.web3.eth.sendTransaction({
      ...txData,
    })

    return signed
  }

  async signData (data) {
    const signature = await this.web3.eth.personal.sign(data, this.address)

    return {
      signature,
    }
  }
}
