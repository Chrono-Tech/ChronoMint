/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractProvider from './AbstractProvider'

export default class AbstractEthereumProvider extends AbstractProvider {
  constructor (id, ...rest) {
    super(...rest)
    this._id = id
  }

  subscribe (ethAddress) {
    const node = this._selectNode(this.networkSettings)

    node.emit('subscribe', {
      address: ethAddress,
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
}
