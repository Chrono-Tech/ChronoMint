import BigNumber from 'bignumber.js'
import bitcoinProvider from 'network/BitcoinProvider'
import type TxModel from 'models/TxModel'

export class BitcoinDAO {

  static getName () {
    return 'Bitcoin'
  }

  static getSymbol () {
    return 'BTC'
  }

  getAccount () {
    return bitcoinProvider.getAddress()
  }

  getName () {
    return BitcoinDAO.getName()
  }

  getSymbol () {
    return BitcoinDAO.getSymbol()
  }

  isInitialized () {
    return true
  }

  getDecimals () {
    return 8
  }

  async getAccountBalances () {
    const { balance0, balance6 } = await bitcoinProvider.getAccountBalances()
    return {
      balance: new BigNumber(balance0 || balance6),
      balance0: new BigNumber(balance0),
      balance6: new BigNumber(balance6)
    }
  }

  // eslint-disable-next-line no-unused-vars
  async transfer (to, amount: BigNumber) {
    return await bitcoinProvider.transfer(to, amount)
  }

  // eslint-disable-next-line no-unused-vars
  async getTransfer (id, account = this.getAccount()): Promise<Array<TxModel>> {
    // TODO @ipavlenko: Change the purpose of TxModel, add support of Bitcoin transactions
    return []
  }

  // eslint-disable-next-line no-unused-vars
  async watchTransfer (callback) {
    // TODO @ipavlenko: Proxy to the BitcoinNode
  }

  // eslint-disable-next-line no-unused-vars
  async watchApproval (callback) {
    // TODO @ipavlenko: Add isApproveRequired flag
  }
}

export default new BitcoinDAO()
