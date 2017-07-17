import BigNumber from 'bignumber.js'
import AbstractContractDAO from './AbstractContractDAO'
import type TxModel from 'models/TxModel'

export const TXS_PER_PAGE = 10

export default class AbstractTokenDAO extends AbstractContractDAO {
  constructor (json, at) {
    if (new.target === AbstractTokenDAO) {
      throw new TypeError('Cannot construct AbstractTokenDAO instance directly')
    }
    super(json, at)
  }

  // eslint-disable-next-line no-unused-vars
  getAccountBalance (block = 'latest', account = this.getAccount()): BigNumber {
    throw new Error('should be overridden')
  }

  isInitialized () {
    throw new Error('should be overridden')
  }

  initMetaData () {
    throw new Error('should be overridden')
  }

  getDecimals () {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line no-unused-vars
  addDecimals (amount: BigNumber): BigNumber {
    return amount
  }

  // eslint-disable-next-line no-unused-vars
  removeDecimals (amount: BigNumber): BigNumber {
    return amount
  }

  getSymbol () {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line no-unused-vars
  transfer (account, amount: BigNumber) {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line no-unused-vars
  getTransfer (id, account = this.getAccount()): Array<TxModel> {
    throw new Error('should be overridden')
  }

  /**
   * @param callback will receive...
   * @see TransferNoticeModel with...
   * @see TxModel
   */
  // eslint-disable-next-line no-unused-vars
  watchTransfer (callback) {
    throw new Error('should be overridden')
  }
}
