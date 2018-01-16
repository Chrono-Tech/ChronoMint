import BigNumber from 'bignumber.js'
import NemAbstractNode, { NemBalance, NemTx } from './NemAbstractNode'

export default class NemMiddlewareNode extends NemAbstractNode {
  constructor ({ mosaics, ...args }) {
    super(args)
    this._mosaics = mosaics
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
              const { balance, mosaics } = data
              this.emit('balance', new NemBalance({
                address,
                balance: readXemBalance(balance),
                mosaics: readMosaicsBalances(mosaics),
              }))
            } catch (e) {
              this.trace('Failed to decode message', e)
            }
          },
        )
        this._subscriptions[ `tx:${address}` ] = this._client.subscribe(
          `${this._socket.channels.tx}.${address}`,
          // `${socket.channels.balance}.*`,
          (message) => {
            try {
              this.trace('NEM Tx RAW', message)
              const data = JSON.parse(message.body)
              this.trace('NEM Tx', data)
              // const { balance, mosaics } = data
              // this.emit('balance', new NemBalance({
              //   address,
              //   balance: readXemBalance(balance),
              //   mosaics: readMosaicsBalances(mosaics),
              // }))
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
          const subscription2 = this._subscriptions[ `tx:${address}` ]
          if (subscription2) {
            delete this._subscriptions[ `tx:${address}` ]
            subscription2.unsubscribe()
          }
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

  async getFeeRate () {
    // async by design
    return this._feeRate
  }

  getMosaics () {
    return this._mosaics
  }

  async getAddressInfo (address) {
    try {
      const { data } = await this._api.get(`addr/${address}/balance`)
      const { balance, mosaics } = data
      return new NemBalance({
        address,
        balance: readXemBalance(balance),
        mosaics: readMosaicsBalances(mosaics),
      })
    } catch (e) {
      this.trace(`getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async send (account, rawtx) {
    try {
      const { data } = await this._api.post('tx/send', rawtx)
      console.log(data.transactionHash.data, data)
      const tx = await this.getTransactionInfo(data.transactionHash.data)
      // {"innerTransactionHash":{},"code":1,"type":1,"message":"SUCCESS","transactionHash":{"data":"7fc8813eefb04577e603f6179601ae3250602d6a76da6d1c411e8e418bc35b49"}}
      const model = this._createTxModel({
        ...tx,
        transactionHash: data.transactionHash.data,
      }, account)
      setImmediate(() => {
        this.emit('tx', model)
      })
      return model
    } catch (e) {
      this.trace(`send transaction failed`, e)
      throw e
    }
  }

  _createTxModel (tx, account): NemTx {
    return new NemTx({
      txHash: tx.transactionHash,
      time: Date.now() / 1000, // TODO @ipavlenko: Fix tx.time = 0 on the Middleware
      from: tx.sender,
      to: tx.recipient,
      value: new BigNumber(tx.amount),
      fee: new BigNumber(tx.fee),
      credited: tx.sender !== account,
    })
  }
}

function readXemBalance (balance) {
  const { confirmed, unconfirmed, vested } = balance
  return {
    confirmed: confirmed.amount == null ? null : new BigNumber(confirmed.value),
    unconfirmed: unconfirmed.amount == null ? null : new BigNumber(unconfirmed.value),
    vested: vested.amount == null ? null : new BigNumber(vested.value),
  }
}

function readMosaicsBalances (mosaics) {
  return Object.entries(mosaics).reduce((t, [ k, v ]) => ({
    ...t,
    [ k ]: {
      confirmed: new BigNumber(v.value),
      // TODO @ipavlenko: Add unconfirmed balance for Mosaics
    },
  }), {})
}
