import BigNumber from 'bignumber.js'
import nem from 'nem-sdk'
import TxModel from 'models/TxModel'
import NemAbstractNode, { NemBalance, NemTx } from './NemAbstractNode'

export default class NemMiddlewareNode extends NemAbstractNode {
  constructor ({ mosaics, ...args }) {
    super(args)
    this._mosaics = mosaics
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
          const { balance, mosaics } = data
          this.emit('balance', new NemBalance({
            address,
            balance: readXemBalance(balance),
            mosaics: readMosaicsBalances(mosaics),
          }))
        })
        this._openSubscription(`${this._socket.channels.transaction}.${address}`, (data) => {
          this.trace('NEM Tx', data)
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
      txs.push(this.createTxModel(tx, address))
    }
    return txs
  }
}

function createTxModel (tx, account): NemTx {
  return new NemTx({
    txHash: tx.hash,
    time: new Date(nem.utils.format.nemDate(tx.timeStamp)).getTime() / 1000, // TODO @ipavlenko: Fix tx.time = 0 on the Middleware
    from: tx.sender,
    signer: tx.signer,
    to: tx.recipient,
    value: new BigNumber(tx.amount),
    fee: new BigNumber(tx.fee),
    credited: tx.recipient === account,
    mosaics: !(tx.mosaics && tx.mosaics.length)
      ? null
      : tx.mosaics.reduce((t, m) => ({
        ...t,
        [ `${m.mosaicId.namespaceId}:${m.mosaicId.name}` ]: m.quantity,
      }), {}),
    unconfirmed: tx.unconfirmed || false,
  })
}

function readXemBalance (balance) {
  const { confirmed, unconfirmed, vested } = balance
  return {
    confirmed: confirmed.value == null ? null : new BigNumber(confirmed.value),
    unconfirmed: unconfirmed.value == null ? null : new BigNumber(unconfirmed.value),
    vested: vested.value == null ? null : new BigNumber(vested.value),
  }
}

function readMosaicsBalances (mosaics) {
  return Object.entries(mosaics || {}).reduce((t, [ k, v ]) => ({
    ...t,
    [ k ]: {
      confirmed: v.confirmed == null ? null : new BigNumber(v.confirmed.value),
      unconfirmed: v.unconfirmed == null ? null : new BigNumber(v.unconfirmed.value),
    },
  }), {})
}
