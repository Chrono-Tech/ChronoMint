import AbstractContractDAO from './AbstractContractDAO'

export default class AbstractTokenDAO extends AbstractContractDAO {
  constructor (json, at) {
    if (new.target === AbstractTokenDAO) {
      throw new TypeError('Cannot construct AbstractTokenDAO instance directly')
    }
    super(json, at)
  }

  // eslint-disable-next-line no-unused-vars
  getAccountBalance (account) {
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
  addDecimals (amount: number) {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line no-unused-vars
  removeDecimals (amount: number) {
    throw new Error('should be overridden')
  }

  getSymbol () {
    throw new Error('should be overridden')
  }

  getName () {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line no-unused-vars
  transfer (amount, recipient) {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line no-unused-vars
  getTransfer (account, id): Array<TransactionModel> {
    throw new Error('should be overridden')
  }

  /**
   * @param callback will receive TransferNoticeModel and isOld flag
   * @see TransferNoticeModel with...
   * @see TransactionModel
   */
  // eslint-disable-next-line no-unused-vars
  watchTransfer (callback) {
    throw new Error('should be overridden')
  }
}
