import AbstractContractDAO from './AbstractContractDAO'

export default class AbstractTokenDAO extends AbstractContractDAO {
  // noinspection JSUnusedLocalSymbols
  getAccountBalance (account) {
    throw new Error('should be overridden')
  }

  isInitialized () {
    throw new Error('should be overridden')
  }

  getDecimals () {
    throw new Error('should be overridden')
  }

  addDecimals (amount: number) {
    throw new Error('should be overridden')
  }

  removeDecimals (amount: number) {
    throw new Error('should be overridden')
  }

  getSymbol () {
    throw new Error('should be overridden')
  }

  getName () {
    throw new Error('should be overridden')
  }

  // noinspection JSUnusedLocalSymbols
  transfer (amount, recipient) {
    throw new Error('should be overridden')
  }

  // noinspection JSUnusedLocalSymbols
  getTransfer (account, fromBlock, toBlock) {
    throw new Error('should be overridden')
  }

  /**
   * @param callback will receive TransferNoticeModel and isOld flag
   * @see TransferNoticeModel with...
   * @see TransactionModel
   */
  watchTransfer (callback) {
    throw new Error('should be overridden')
  }
}
