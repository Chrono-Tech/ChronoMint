import BigNumber from 'bignumber.js'
import AbstractContractDAO from './AbstractContractDAO'
import type TxModel from 'models/TxModel'
import { address } from 'components/forms/validator'

export const TXS_PER_PAGE = 10

export default class AbstractTokenDAO extends AbstractContractDAO {
  constructor (json, at) {
    if (new.target === AbstractTokenDAO) {
      throw new TypeError('Cannot construct AbstractTokenDAO instance directly')
    }
    super(json, at)
  }

  // eslint-disable-next-line no-unused-vars
  getAccountBalance (account = this.getAccount(), block = 'latest'): BigNumber {
    throw new Error('should be overridden')
  }

  isApproveRequired () {
    return true
  }

  getAddressValidator () {
    return address
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

  addDecimals (amount: BigNumber): BigNumber {
    return new BigNumber(amount.toString(10))
  }

  removeDecimals (amount: BigNumber): BigNumber {
    return new BigNumber(amount.toString(10))
  }

  getSymbol () {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line no-unused-vars
  transfer (account, amount: BigNumber) {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line no-unused-vars
  getTransfer (id, account = this.getAccount()): Promise<Array<TxModel>> {
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

  // eslint-disable-next-line
  watchApproval (callback) {
    // no code for EthereumDAO
  }
}
