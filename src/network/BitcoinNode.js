import axios from 'axios'
import EventEmitter from 'events'

// TODO @ipavlenko: Rename to BlockexplorerNode when add another Node implementation
export class BitcoinNode extends EventEmitter {

  constructor ({ api, trace }) {
    super()
    this._api = api
    this._trace = trace
    // TODO @ipavlenko: Instantiate here permanent socket connection to the bitcoin Node
  }

  trace () {
    if (this._trace) {
      // eslint-disable-next-line
      console.log.apply(console, arguments)
    }
  }

  async getTransactionInfo (txid) {
    try {
      const res = await this._api.get(`/api/tx/${txid}`)
      return res.data
    } catch (e) {
      this.trace(`getTransactionInfo ${txid} failed`, e)
      throw e
    }
  }

  async getAddressInfo (address) {
    try {
      const res = await this._api.get(`/api/addr/${address}?noTxList=1&noCache=1`)
      const { balance, unconfirmedBalance } = res.data
      return {
        balance0: balance + unconfirmedBalance,
        balance6: balance
      }
    } catch (e) {
      this.trace(`getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async getAddressUTXOS (address) {
    try {
      const res = await this._api.get(`/api/addr/${address}/utxo`)
      return res.data
    } catch (e) {
      this.trace(`getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async send (rawtx) {
    try {
      const params = new URLSearchParams()
      params.append('rawtx', rawtx)
      const res = await this._api.post(`/api/tx/send`, params)
      // TODO @ipavlenko: Temporary emulate event from the socket
      setTimeout(() => {
        this.emit('tx', res.data)
      }, 0)

      return res.data
    } catch (e) {
      this.trace(`send transaction ${rawtx} failed`, e)
      throw e
    }
  }
}

export const MAINNET = new BitcoinNode({
  api: axios.create({
    baseURL: 'https://blockexplorer.com/',
    timeout: 4000
  }),
  trace: false
})

export const TESTNET = new BitcoinNode({
  api: axios.create({
    baseURL: 'https://testnet.blockexplorer.com/',
    timeout: 4000
  }),
  trace: true
})
