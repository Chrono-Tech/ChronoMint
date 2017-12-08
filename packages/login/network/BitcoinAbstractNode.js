import EventEmitter from 'events'

export default class BitcoinAbstractNode extends EventEmitter {

  trace () {
    if (this._trace) {
      // eslint-disable-next-line
      console.log.apply(console, arguments)
    }
  }

  // eslint-disable-next-line
  async getTransactionInfo (txid) {
    throw new Error('Not implemented')
  }

  // eslint-disable-next-line
  async getAddressInfo (address) {
    throw new Error('Not implemented')
  }

  // eslint-disable-next-line
  async getAddressUTXOS (address) {
    throw new Error('Not implemented')
  }

  // eslint-disable-next-line
  async send (rawtx) {
    throw new Error('Not implemented')
  }
}
