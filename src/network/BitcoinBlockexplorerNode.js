import BitcoinAbstractNode from './BitcoinAbstractNode'

// TODO @ipavlenko: Rename to BlockexplorerNode when add another Node implementation
export default class BitcoinBlockexplorerNode extends BitcoinAbstractNode {
  constructor ({ api, trace }) {
    super()
    this._api = api
    this._trace = trace
    // TODO @ipavlenko: Instantiate here permanent socket connection to the bitcoin Node
  }

  async getTransactionInfo (txid) {
    try {
      const res = await this._api.get(`/tx/${txid}`)
      return res.data
    } catch (e) {
      this.trace(`getTransactionInfo ${txid} failed`, e)
      throw e
    }
  }

  async getAddressInfo (address) {
    try {
      const res = await this._api.get(`/addr/${address}?noTxList=1&noCache=1`)
      const { balance, unconfirmedBalance } = res.data
      return {
        balance0: balance + unconfirmedBalance,
        balance6: balance,
      }
    } catch (e) {
      this.trace(`getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async getAddressUTXOS (address) {
    try {
      const res = await this._api.get(`/addr/${address}/utxo`)
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
      const res = await this._api.post('/tx/send', params)
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
