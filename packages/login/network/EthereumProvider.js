/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'
import networkService from './NetworkService'
import networkProvider, { byEthereumNetwork } from './NetworkProvider'
import AbstractProvider from './AbstractProvider'
import EthereumEngine from './EthereumEngine'
import selectEthereumNode from './EthereumNode'
import web3Provider from './Web3Provider'

export class EthereumProvider extends AbstractProvider {
  constructor () {
    super(...arguments)
    this._nemEngine = null
    this._id = 'Ethereum'
  }

  setEngine (ethEngine: EthereumEngine, nemEngine) {
    if (this._isInited) {
      this.unsubscribe(this._engine, this._nemEngine)
    }
    this._engine = ethEngine
    this._nemEngine = nemEngine
    this.subscribe(this._engine, this._nemEngine)
    this._isInited = true
  }

  subscribe (ethEngine: EthereumEngine, nemEngine) {
    const node = this._selectNode(ethEngine)

    node.emit('subscribe', {
      ethAddress: ethEngine.getAddress(),
      nemAddress: nemEngine && nemEngine.getAddress(),
    })
    return node
  }

  unsubscribe (ethEngine: EthereumEngine, nemEngine) {
    const node = this._selectNode(ethEngine)
    node.emit('unsubscribe', {
      ethAddress: ethEngine.getAddress(),
      nemAddress: nemEngine && nemEngine.getAddress(),
    })
    return node
  }

  getTransactionsList (address, skip, offset) {
    const node = this._selectNode(this._engine)
    return node.getTransactionsList(address, this._id, skip, offset)
  }

  getPrivateKey () {
    return this._engine ? this._engine.getPrivateKey() : null
  }

  createNewChildAddress (deriveNumber) {
    return this._engine ? this._engine.createNewChildAddress(deriveNumber) : null
  }

  getPlatformList (userAddress: string) {
    const node = this._selectNode(this._engine)
    return node.getPlatformList(userAddress)
  }

  getEventsData (eventName: string, queryFilter: string, mapCallback) {
    const node = this._selectNode(this._engine)
    return node.getEventsData(eventName, queryFilter, mapCallback)
  }

  subscribeOnMiddleware (event, callback) {
    const node = this._selectNode(this._engine)
    node.on(event, callback)
  }

  getWallet () {
    return this._engine ? this._engine._wallet : null
  }

  getNemEngine () {
    return this._nemEngine
  }

  addNewEthWallet (num_addresses) {
    const { network, url } = networkService.getProviderSettings()
    const wallet = ethereumProvider.getWallet()
    const newEngine = new EthereumEngine(wallet, network, url, null, num_addresses)

    const web3 = new Web3()

    web3Provider.reinit(web3, newEngine.getProvider())
    networkProvider.setNetworkCode(byEthereumNetwork(network))

    ethereumProvider.setEngine(newEngine, ethereumProvider.getNemEngine())
  }
}

export const ethereumProvider = new EthereumProvider(selectEthereumNode)
