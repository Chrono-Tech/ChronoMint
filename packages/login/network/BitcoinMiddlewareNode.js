import BigNumber from 'bignumber.js'
import BitcoinAbstractNode, { BitcoinTx, BitcoinBalance } from './BitcoinAbstractNode'
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

  async _handleSubscribe (address) {
    if (!this._socket) {
      return
    }
    try {
      await this._api.post('addr', { address })
      this.executeOrSchedule(() => {
        this._subscriptions[ `balance:${address}` ] = this._client.subscribe(
          `${this._socket.channels.balance}.${address}`,
          // `${socket.channels.balance}.*`,
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
          const subscription = this._subscriptions[ `balance:${address}` ]
          if (subscription) {
            delete this._subscriptions[ `balance:${address}` ]
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

  async getTransactionsList (address) {
    return []
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
      this.trace(`getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async getAddressUTXOS (address) {
    try {
      const res = await this._api.get(`addr/${address}/utxo`)
      return res.data
    } catch (e) {
      this.trace(`getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async send (account, rawtx) {
    try {
      const params = new URLSearchParams()
      params.append('tx', rawtx)
      const res = await this._api.post('tx/send', params)
      const model = this._createTxModel(res.data, account)
      setImmediate(() => {
        this.emit('tx', model)
      })
      return model
    } catch (e) {
      this.trace(`send transaction ${rawtx} failed`, e)
      throw e
    }
  }

  _createTxModel (tx, account): BitcoinTx {
    const from = tx.isCoinBase ? 'coinbase' : tx.inputs.map((input) => input.addresses.join(',')).join(',')
    const to = tx.outputs.map((output) => output.scriptPubKey.addresses.filter((a) => a !== account).join(',')).join(',')

    let value = new BigNumber(0)
    for (const output of tx.outputs) {
      if (output.scriptPubKey.addresses.indexOf(account) < 0) {
        value = value.add(new BigNumber(output.value))
      }
    }

    return new BitcoinTx({
      txHash: tx.txid,
      time: Date.now() / 1000, // TODO @ipavlenko: Fix tx.time = 0 on the Middleware
      from,
      to,
      value,
      fee: new BigNumber(tx.fee).mul(DECIMALS),
      credited: tx.isCoinBase || !tx.inputs.filter((input) => input.addresses.indexOf(account) >= 0).length,
    })
  }
}
