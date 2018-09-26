/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractProvider from './AbstractProvider'
import selectEthereumNode from './EthereumNode'

export class EthereumProvider extends AbstractProvider {
  constructor () {
    super(...arguments)
    this._id = 'Ethereum'
  }

  subscribe (ethAddress) {
    const node = this._selectNode(this.networkSettings)

    node.emit('subscribe', {
      ethAddress,
    })
    return node
  }

  unsubscribe (ethAddress) {
    const node = this._selectNode(this.networkSettings)
    node.emit('unsubscribe', {
      ethAddress,
    })
    return node
  }

  subscribeNewWallet (address) {
    const node = this._selectNode(this.networkSettings)
    node.subscribeNewWallet(address)
  }

  getTransactionsList (address, skip, offset) {
    const node = this._selectNode(this.networkSettings)
    return node.getTransactionsList(address, this._id, skip, offset)
  }

  getPlatformList (userAddress: string) {
    const node = this._selectNode(this.networkSettings)
    return node.getPlatformList(userAddress)
  }

  getEventsData (eventName: string, queryFilter: string, mapCallback) {
    const node = this._selectNode(this.networkSettings)
    return node.getEventsData(eventName, queryFilter, mapCallback)
  }

  subscribeOnMiddleware (event, callback) {
    const node = this._selectNode(this.networkSettings)
    node.on(event, callback)
  }

  get2FAEncodedKey (callback) {
    const node = this._selectNode(this.networkSettings)
    return node.get2FAEncodedKey(this.networkSettings, callback)
  }

  confirm2FASecret (account, confirmToken, callback) {
    const node = this._selectNode(this.networkSettings)
    return node.confirm2FASecret(account, confirmToken, callback)
  }

  confirm2FAtx (txAddress, walletAddress, confirmToken, callback) {
    const node = this._selectNode(this.networkSettings)
    return node.confirm2FAtx(txAddress, walletAddress, confirmToken, callback)
  }

  checkConfirm2FAtx (txAddress, callback) {
    const node = this._selectNode(this.networkSettings)
    return node.checkConfirm2FAtx(txAddress, callback)
  }

  async getAccountBalances (address) {
    const node = this._selectNode(this.networkSettings)
    const data = await node.getAddressInfo(address.toLowerCase())
    return {
      balance: data.balance,
      tokens: data.erc20token,
    }
  }
}

export const ethereumProvider = new EthereumProvider(selectEthereumNode)
