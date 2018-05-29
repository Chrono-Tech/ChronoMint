/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import AbstractNode from './AbstractNode'
import EthCrypto from 'eth-crypto'

const eventsList = [
  'platformrequested',
  'assetcreated',
  'restricted',
  'unrestricted',
  'paused',
  'unpaused',
  'issue',
  'revoke',
]

export default class EthereumMiddlewareNode extends AbstractNode {
  constructor () {
    super(...arguments)

    this.addListener('subscribe', (address) => this._handleSubscribe(address))
    this.addListener('unsubscribe', (address) => this._handleUnsubscribe(address))
    this.connect()
  }

  async _handleSubscribe ({ ethAddress, nemAddress }) {
    if (!this._socket) {
      return
    }
    try {
      await this._api.post('addr', {
        address: ethAddress,
        nem: nemAddress,
      })

      this.executeOrSchedule(() => {
        eventsList.map((event) => {
          this._openSubscription(`${this._socket.channels.events}.${event}`, (data) => {
            this.trace(event, data)
            this.emit(event, data)
          })
        })
      })

    } catch (e) {
      this.trace('Address subscription error', e)
    }
  }

  async _handleUnsubscribe ({ ethAddress, nemAddress }) {
    try {
      await this._api.delete('addr', {
        address: ethAddress,
        nem: nemAddress,
      })
    } catch (e) {
      this.trace('Address unsubscription error', e)
    }
  }

  async getTransactionsList (address, id, skip, offset) {
    const url = `tx/${address}/history?skip=${skip}&limit=${offset}`
    const { data } = await this._api.get(url)
    return data
  }

  async getEventsData (eventName: string, queryFilter: string, mapCallback) {
    const response = await this._api.get(`events/${eventName}/?${queryFilter}`)
    if (response && response.data.length) {
      return typeof mapCallback === 'function' ? response.data.map(mapCallback) : response.data
    }

    return []
  }

  async get2FAEncodedKey (engine, walletAddress, callback) {
    const response = await this._twoFA.post(`/wallet/${walletAddress}`, {
      pubkey: engine.getPublicKey(),
    })
    // eslint-disable-next-line
    console.log('get2FAEncodedKey', engine.getPrivateKey(), response.data)
    const code = await EthCrypto.decryptWithPrivateKey(`0x${engine.getPrivateKey()}`, response.data)
    if (code) {
      return typeof callback === 'function' ? callback(code) : code
    }
  }

  async confirm2FAtx (engine, walletAddress, callback) {
    const response = await this._twoFA.post(`/wallet/${walletAddress}/confirm`, {
      pubkey: engine.getPublicKey(),
    })
    const code = await EthCrypto.decryptWithPrivateKey(`0x${engine.getPrivateKey()}`, response.data)
    if (code) {
      return typeof callback === 'function' ? callback(code) : code
    }
  }
}
