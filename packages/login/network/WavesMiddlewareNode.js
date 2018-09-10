/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { WavesBalance, WavesTx } from './WavesAbstractNode'
import AbstractNode from './AbstractNode'

export default class WavesMiddlewareNode extends AbstractNode {
  constructor ({ ...args }) {
    super(args)
    // TODO @dkchv: still can't combine async + arrow on class
    this.addListener('subscribe', (address) => this._handleSubscribe(address))
    this.addListener('unsubscribe', (address) => this._handleUnsubscribe(address))
    this.connect()
  }

  async _handleSubscribe (address) {
    if (!this._socket) {
      return
    }
    try {
      await this._api.post('addr', { address })
      this.executeOrSchedule(() => {
        this._openSubscription(`${this._socket.channels.balance}.${address}`, (data) => {
          this.trace('Address Balance', data)
          const { balance, assets } = data
          this.emit('balance', new WavesBalance({
            address,
            balance: balance,
            assets: assets,
          }))
        })
        this._openSubscription(`${this._socket.channels.transaction}.${address}`, (data) => {
          this.trace('WAVES Tx', data)
          this.emit('tx', createTxModel(data, address))
        })
      })
    } catch (e) {
      this.trace('Address subscription error', e)
    }
  }

  async _handleUnsubscribe (address) {
    if (this._socket) {
      try {
        await this._api.delete('addr', { address })
        this.executeOrSchedule(() => {
          this._closeSubscription(`${this._socket.channels.balance}.${address}`)
          this._closeSubscription(`${this._socket.channels.transaction}.${address}`)
        })
      } catch (e) {
        this.trace('Address unsubscription error', e)
      }
    }
  }

  async getTransactionInfo (txid) {
    try {
      const res = await this._api.get(`tx/${txid}`)
      this.trace(res)
      return res.data
    } catch (e) {
      this.trace(`getTransactionInfo ${txid} failed`, e)
      throw e
    }
  }

  async getAddressInfo (address) {
    try {
      const { data } = await this._api.get(`addr/${address}/balance`)
      const { balance, assets } = data
      return new WavesBalance({
        address,
        balance: balance,
        assets: assets,
      })
    } catch (e) {
      this.trace(`getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async send (account, rawtx) {
    try {
      const { data } = await this._api.post('tx/send', rawtx)
      // const model = createTxModel(data.transaction, account)
      // setImmediate(() => {
      //   this.emit('tx', model)
      // })
      return data
    } catch (e) {
      this.trace(`send transaction failed`, e)
      throw e
    }
  }

  async getTransactionsList (address, id, skip, offset) {
    let txs = []
    const url = `tx/${address}/history?skip=${skip}&limit=${offset}`
    const { data } = await this._api.get(url)
    if (!data) {
      throw new Error('invalid result')
    }
    for (const tx of data) {
      txs.push(createTxModel(tx, address))
    }
    return txs
  }
}

function createTxModel (tx, account): WavesTx {
  return new WavesTx({
    type: tx.type,
    id: tx.id,
    sender: tx.sender,
    signerPublicKey: tx.signerPublicKey,
    fee: tx.fee,
    timestamp: tx.timestamp,
    signature: tx.signature,
    recipient: tx.recipient === account,
    assetId: tx.assetId,
    amount: tx.amount,
    feeAsset: tx.feeAsset,
    attachment: tx.attachment,
    blockNumber: tx.blockNumber,
    hash: tx.hash,
    address: tx.address,
  })
}
