import AbstractNode from './AbstractNode'

export default class BitcoinAbstractNode extends AbstractNode {
  constructor ({ api, socket, trace }) {
    super({ api, socket, trace })
  }

  getFeeRate () {
    throw new Error('Not implemented')
  }

  /**
   * @abstract
   * @param address
   */
  // eslint-disable-next-line
  getAddressUTXOS (address) {
    throw new Error('Not implemented')
  }
}
