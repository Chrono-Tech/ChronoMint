/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import BitcoinAbstractNode, { BitcoinTx, BitcoinBalance } from './BitcoinAbstractNode'
import { DECIMALS } from './BitcoinEngine'

export default class BitcoinBlockexplorerNode extends BitcoinAbstractNode {
  async getTransactionInfo (txid) {
    try {
      const res = await this._api.get(`tx/${txid}`)
      return res.data
    } catch (e) {
      this.trace(`getTransactionInfo ${txid} failed`, e)
      throw e
    }
  }

  async getTransactionsList (address): Array<BitcoinTx> {
    try {
      const response = await this._api.get(`addrs/${address}/txs`)
      return (response.data.items || []).map((tx) => this._createTxModel(tx, address))
    } catch (e) {
      this.trace(`getTransactionsList ${address} failed`, e)
      throw e
    }
  }

  async getFeeRate () {
    try {
      const res = await this._api.get(`utils/estimatefee?nbBlocks=2`)
      const rate = res.data[ '2' ]
      return rate > 0
        ? DECIMALS * rate / 1024
        : 150 // default satoshis per byte for testnets
    } catch (e) {
      this.trace(`getFeeRate failed`, e)
      throw e
    }
  }

  async getAddressInfo (address) {
    try {
      const [ confirmed, unconfirmed ] = await Promise.all([
        this._api.get(`addr/${address}/balance`),
        this._api.get(`addr/${address}/unconfirmedBalance`),
      ])
      const [ balanceSat, unconfirmedBalanceSat ] = [ confirmed.data, unconfirmed.data ]
      return {
        balance0: new BigNumber(balanceSat).plus(unconfirmedBalanceSat),
        balance3: new BigNumber(balanceSat),
        balance6: new BigNumber(balanceSat),
      }
    } catch (e) {
      this.trace(`BitcoinBlockexplorerNode getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async getAddressUTXOS (address) {
    try {
      const res = await this._api.get(`addr/${address}/utxo`)
      return res.data
    } catch (e) {
      this.trace(`BitcoinBlockexplorerNode getAddressUTXOS ${address} failed`, e)
      throw e
    }
  }

  async send (account, rawtx) {
    try {
      const balances = await this.getAddressInfo(account)
      const params = new URLSearchParams()
      params.append('rawtx', rawtx)
      const res = await this._api.post('tx/send', params)
      const tx = await this.getTransactionInfo(res.data.txid)
      const model = this._createTxModel(tx, account)
      setImmediate(() => {
        this.emit('tx', model)
        this.emit('balance', new BitcoinBalance({
          address: account,
          ...balances,
          balance0: balances.balance0.minus(model.value).minus(model.fee),
        }))
      })
      return model
    } catch (e) {
      this.trace(`send transaction ${rawtx} failed`, e)
      throw e
    }
  }

  _createTxModel (tx, account): BitcoinTx {
    const from = tx.isCoinBase ? 'coinbase' : tx.vin.map((input) => input.addr).join(',')
    const to = tx.vout.map((output) => output.scriptPubKey.addresses.filter((a) => a !== account).join(',')).join(',')

    let value = new BigNumber(0)
    for (const output of tx.vout) {
      if (output.scriptPubKey.addresses.indexOf(account) < 0) {
        value = value.add(new BigNumber(output.value))
      }
    }

    return new BitcoinTx({
      txHash: tx.txid,
      blockHash: tx.blockhash,
      blockNumber: tx.blockheight,
      time: tx.time,
      from,
      to,
      value: value.mul(DECIMALS),
      fee: new BigNumber(tx.fees).mul(DECIMALS),
      credited: tx.isCoinBase || !tx.vin.filter((input) => input.addr === account).length,
    })
  }
}
