import Amount from '@/models/Amount'
import type TokenModel from 'models/tokens/TokenModel'
import BigNumber from 'bignumber.js'
import type TxModel from 'models/TxModel'
import { address } from 'models/validator'
import AbstractContractDAO from './AbstractContractDAO'

export const TXS_PER_PAGE = 10

export default class AbstractTokenDAO extends AbstractContractDAO {
  constructor (json, at) {
    if (new.target === AbstractTokenDAO) {
      throw new TypeError('Cannot construct AbstractTokenDAO instance directly')
    }
    super(json, at)
  }

  // eslint-disable-next-line no-unused-vars
  getAccountBalance (account = this.getAccount()): BigNumber {
    throw new Error('should be overridden')
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

  addDecimals (amount: Amount): Amount {
    return amount
  }

  removeDecimals (amount: Amount): Amount {
    return amount
  }

  getSymbol () {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line no-unused-vars
  transfer (account, amount: Amount) {
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
  watchTransfer (account, callback) {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line
  watchApproval (callback) {
    // no code for EthereumDAO
  }
}
