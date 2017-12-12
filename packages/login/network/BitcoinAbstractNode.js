import AbstractNode from './AbstractNode'

export default class BitcoinAbstractNode extends AbstractNode {

  async getFeeRate () {
    throw new Error('Not implemented')
  }

  /**
   * @abstract
   * @param address
   */
  // eslint-disable-next-line
  async getAddressUTXOS (address) {
    throw new Error('Not implemented')
  }
}
