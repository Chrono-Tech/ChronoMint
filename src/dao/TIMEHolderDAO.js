import AbstractContractDAO from './AbstractContractDAO'
import ContractsManagerDAO from './ContractsManagerDAO'

export const TX_DEPOSIT = 'deposit'
export const TX_WITHDRAW_SHARES = 'withdrawShares'

export default class TIMEHolderDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/TimeHolder.json'), at)
  }

  /** @returns {Promise.<ERC20DAO>} */
  getAssetDAO () {
    return this._call('sharesContract').then(address => {
      return ContractsManagerDAO.getERC20DAO(address)
    })
  }

  async deposit (amount: number) {
    const assetDAO = await this.getAssetDAO()
    const account = await this.getAddress()
    await assetDAO.approve(account, amount)
    return this._tx(TX_DEPOSIT, [assetDAO.addDecimals(amount)], {amount})
  }

  async withdraw (amount: number) {
    const assetDAO = await this.getAssetDAO()
    return this._tx(TX_WITHDRAW_SHARES, [assetDAO.addDecimals(amount)], {amount})
  }

  async getAccountDepositBalance (account: string) {
    const assetDAO = await this.getAssetDAO()
    return this._callNum('depositBalance', [account]).then(r => assetDAO.removeDecimals(r))
  }
}
