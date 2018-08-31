/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import BitcoinAbstractNode, { BitcoinBalance, BitcoinTx } from './BitcoinAbstractNode'
import { DECIMALS } from './BitcoinEngine'

export default class BitcoinMiddlewareNode extends BitcoinAbstractNode {
  constructor ({ feeRate, ...args }) {
    super(args)
    // TODO @ipavlenko: Remove it after the relevant REST be implemented on the Middleware
    this._feeRate = feeRate
    this._subscriptions = {}
    // TODO @dkchv: still can't combine async + arrow on class
    this.addListener('subscribe', (address) => this._handleSubscribe(address))
    this.addListener('unsubscribe', (address) => this._handleUnsubscribe(address))
    this.connect()
  }

  subscribeNewWallet (address) {
    this._handleSubscribe(address)
    this.addListener('unsubscribe', (address) => this._handleUnsubscribe(address))
  }

  async _handleSubscribe (address) {
    if (!this._socket) {
      return
    }
    try {
      await this._api.post('addr', { address })
      this.executeOrSchedule(() => {
        this._subscriptions[`balance:${address}`] = this._client.subscribe(
          `${this._socket.channels.balance}.${address}`,
          (message) => {
            try {
              const data = JSON.parse(message.body)
              this.trace('Address Balance', data)
              this.emit('balance', new BitcoinBalance({
                address,
                balance0: data.balances.confirmations0 != null // nil check
                  ? new BigNumber(data.balances.confirmations0)
                  : null,
                balance3: data.balances.confirmations3 != null // nil check
                  ? new BigNumber(data.balances.confirmations3)
                  : null,
                balance6: data.balances.confirmations6 != null // nil check
                  ? new BigNumber(data.balances.confirmations6)
                  : null,
              }))
            } catch (e) {
              this.trace('Failed to decode message', e)
            }
          },
        )
        if (!this._subscriptions[`lastBlock`]) {
          this._subscriptions[`lastBlock`] = this._client.subscribe(
            `${this._socket.channels.block}`,
            (message) => {
              try {
                const data = JSON.parse(message.body)
                this.trace('Address Balance', data)
                this.emit('lastBlock', data)
              } catch (e) {
                this.trace('Failed to decode message', e)
              }
            },
          )
        }
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
          const subscription = this._subscriptions[`balance:${address}`]
          if (subscription) {
            delete this._subscriptions[`balance:${address}`]
            subscription.unsubscribe()
          }
        })
      } catch (e) {
        this.trace('Address unsubscription error', e)
      }
    }
  }

  disconnect () {
    if (this._socket) {
      this._ws.close()
    }
  }

  async getTransactionInfo (txid) {
    try {
      const res = await this._api.get(`tx/${txid}`)
      return res.data
    } catch (e) {
      this.trace(`getTransactionInfo ${txid} failed`, e)
      throw e
    }
  }

  async getTransactionsList (address, id, skip, offset) {
    const url = `tx/${address}/history?skip=${skip}&limit=${offset}`
    const { data } = await this._api.get(url)
    let txs = []
    if (!data) {
      throw new Error('invalid result')
    }
    if (Array.isArray(data)) {
      for (const tx of data) {
        txs.push(this._createTxModel(tx, address))
      }
    }
    return txs
  }

  getFeeRate (): Promise {
    // async by design
    return this._feeRate
  }

  async getAddressInfo (address) {
    try {
      const res = await this._api.get(`addr/${address}/balance`)
      const {
        confirmations0,
        confirmations3,
        confirmations6,
      } = res.data
      return {
        balance0: new BigNumber(confirmations0.satoshis),
        balance3: new BigNumber(confirmations3.satoshis),
        balance6: new BigNumber(confirmations6.satoshis),
      }
    } catch (e) {
      this.trace(`BitcoinMiddlewareNode getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async getAddressUTXOS (address) {
    try {
      const res = await this._api.get(`addr/${address}/utxo`)
      return res.data
    } catch (e) {
      this.trace(`BitcoinMiddlewareNode getAddressUTXOS ${address} failed`, e)
      throw e
    }
  }

  async send (account, rawtx) {
    try {
      const params = new URLSearchParams()
      params.append('tx', rawtx)
      let res = await this._api.post('tx/send', params)
      let formatInputs = res.data.inputs.map((input) => {
        input.address = input.addresses.join(',')
        return input
      })
      let formatOutputs = res.data.outputs.map((output) => {
        output.address = output.addresses.join(',')
        return output
      })
      res.data.inputs = formatInputs
      res.data.outputs = formatOutputs
      const model = this._createTxModel(res.data, account)
      setImmediate(() => {
        console.log('setImmediate tx: ', model)
        this.emit('tx', model)
      })
      return model
    } catch (e) {
      this.trace(`BitcoinMiddlewareNode send transaction ${rawtx} failed`, e)
      throw e
    }
  }

  _createTxModel (tx, account): BitcoinTx {
    const from = tx.isCoinBase ? 'coinbase' : tx.inputs.map((input) => {
      return Array.isArray(input.addresses) ? input.addresses.join(',') : `${input.address}`
    }).join(',')
    const credited = tx.isCoinBase || !tx.inputs.filter((input) => input.address.indexOf(account) >= 0).length
    const to = tx.outputs.map((output) => `${output.address}`).join(',')
    let value = new BigNumber(0)
    for (const output of tx.outputs) {
      if (credited ? output.address.indexOf(account) >= 0 : output.address.indexOf(account) < 0) {
        value = value.add(new BigNumber(output.value))
      }
    }

    return new BitcoinTx({
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      txHash: tx.hash || tx._id,
      time: tx.timestamp,
      from,
      to,
      value,
      fee: new BigNumber(tx.fee || 0).mul(DECIMALS),
      credited: tx.isCoinBase || !tx.inputs.filter((input) => input.address.indexOf(account) >= 0).length,
    })
  }
}
