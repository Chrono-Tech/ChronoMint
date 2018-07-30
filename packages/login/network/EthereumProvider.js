/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Tx from 'ethereumjs-tx'
import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/actions'
import { AccountCustomNetwork } from '@chronobank/core/models/wallet/persistAccount'
import AbstractProvider from './AbstractProvider'
import EthereumEngine from './EthereumEngine'
import selectEthereumNode from './EthereumNode'
import TxExecModel from '../../core/refactor/models/TxExecModel'
import {
  getNetworkById,
} from './settings'
import {
  DUCK_NETWORK,
} from '../redux/network/actions'

export class EthereumProvider extends AbstractProvider {
  constructor () {
    super(...arguments)
    this._nemEngine = null
    this._wavesEngine = null
    this._id = 'Ethereum'
  }

  setEngine (ethEngine: EthereumEngine, nemEngine, wavesEngine) {
    if (this._isInited) {
      this.unsubscribe(this._engine, this._nemEngine)
      this._isInited = false
    }
    this._engine = ethEngine
    this._nemEngine = nemEngine
    this._wavesEngine = wavesEngine
    this.subscribe(this._engine, this._nemEngine, this._wavesEngine)
    this._isInited = true
  }

  subscribe (ethEngine: EthereumEngine, nemEngine, wavesEngine) {
    const node = this._selectNode(ethEngine)

    node.emit('subscribe', {
      ethAddress: ethEngine.getAddress(),
      nemAddress: nemEngine && nemEngine.getAddress(),
      wavesAddress: wavesEngine && wavesEngine.getAddress(),
    })
    return node
  }

  unsubscribe (ethEngine: EthereumEngine, nemEngine, wavesEngine) {
    const node = this._selectNode(ethEngine)
    node.emit('unsubscribe', {
      ethAddress: ethEngine.getAddress(),
      nemAddress: nemEngine && nemEngine.getAddress(),
      wavesAddress: wavesEngine && wavesEngine.getAddress(),
    })
    return node
  }

  getTransactionsList (address, skip, offset) {
    const node = this._selectNode(this._engine)
    return node.getTransactionsList(address, this._id, skip, offset)
  }

  getProviderSettings = () => {
    const state = this._store.getState()

    const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
    const { selectedNetworkId, selectedProviderId, isLocal } = state.get(DUCK_NETWORK)
    const network = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)

    const { protocol, host } = network

    if (!host) {

      const customNetwork: AccountCustomNetwork = customNetworksList.find((network) => network.id === selectedNetworkId)

      return {
        network: customNetwork,
        url: customNetwork && customNetwork.url,
      }
    }

    return {
      network,
      url: protocol ? `${protocol}://${host}` : `//${host}`,
    }
  }

  getPrivateKey (address) {
    if (address) {
      let pk = null
      this._engine
        // eslint-disable-next-line no-underscore-dangle
        ? this._engine._engine.wallets.map((wallet) => {
          if (wallet.getAddressString() === address) {
            pk = wallet.privKey
          }
        })
        : null
      return pk
    } else {
      return this._engine ? this._engine.getPrivateKey() : null
    }
  }

  getPublicKey () {
    return this._engine ? this._engine.getPublicKey() : null
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
    // eslint-disable-next-line no-underscore-dangle
    return this._engine ? this._engine._wallet : null
  }

  getNemEngine () {
    return this._nemEngine
  }

  addNewEthWallet (num_addresses) {
    const { network, url } = this.getProviderSettings()
    const wallet = this.getWallet()
    const newEngine = new EthereumEngine(wallet, network, url, null, num_addresses)

    this.setEngine(newEngine, ethereumProvider.getNemEngine())

    // web3Provider.pushWallet(num_addresses)
  }

  get2FAEncodedKey (callback) {
    const node = this._selectNode(this._engine)
    return node.get2FAEncodedKey(this._engine, callback)
  }

  confirm2FASecret (account, confirmToken, callback) {
    const node = this._selectNode(this._engine)
    return node.confirm2FASecret(account, confirmToken, callback)
  }

  confirm2FAtx (txAddress, walletAddress, confirmToken, callback) {
    const node = this._selectNode(this._engine)
    return node.confirm2FAtx(txAddress, walletAddress, confirmToken, callback)
  }

  checkConfirm2FAtx (txAddress, callback) {
    const node = this._selectNode(this._engine)
    return node.checkConfirm2FAtx(txAddress, callback)
  }

  getEngine () {
    return this._engine
  }

  async transfer (tx: TxExecModel, web3) {
    console.log('EthereumProvider transfer: ', tx)
    const signedTx = await this.createTransaction(tx, web3)
    const serializedTx = signedTx.serialize().toString('hex')
    return web3.eth.sendSignedTransaction('0x' + serializedTx)
  }

  async createTransaction (tx, web3) {
    const nonce = await web3.eth.getTransactionCount(tx.from)
    const txData = {
      data: tx.data || '',
      nonce: web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(tx.fee.gasLimit.toString()),
      gasPrice: web3.utils.toHex(tx.fee.gasPrice.toString()),
      to: tx.to,
      from: tx.from,
      value: web3.utils.toHex(tx.value.toString()),
    }

    const pk = this.getPrivateKey(tx.from)
    const transaction = new Tx(txData)
    transaction.sign(pk)
    return transaction
  }
}

export const ethereumProvider = new EthereumProvider(selectEthereumNode)
