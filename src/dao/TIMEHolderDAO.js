import AbstractContractDAO from './AbstractContractDAO'
import contractsManagerDAO from './ContractsManagerDAO'
import resultCodes from '../../node_modules/chronobank-smart-contracts/common/errors'

export const TX_DEPOSIT = 'deposit'
export const TX_WITHDRAW_SHARES = 'withdrawShares'

export default class TIMEHolderDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/TimeHolder.json'), at)

    // TODO @dkchv: remove all except OK after SC update and backend research, see MINT-279
    // cause TIMEHOLDER_DEPOSIT_FAILED and TIMEHOLDER_WITHDRAWN_FAILED
    // - is like warning, not error, backend says
    this._okCodes = [
      ...this._okCodes,
      resultCodes.TIMEHOLDER_DEPOSIT_FAILED,
      resultCodes.TIMEHOLDER_WITHDRAWN_FAILED
    ]
  }

  /** @returns {Promise<ERC20DAO>} */
  getAssetDAO () {
    return this._call('sharesContract').then(address => {
      return contractsManagerDAO.getERC20DAO(address)
    })
  }

  async deposit (amount: number) {
    const assetDAO = await this.getAssetDAO()
    const account = await this.getAddress()

    return this._pluralTx([
      assetDAO.getPluralApprove(account, amount),
      {func: TX_DEPOSIT, args: [assetDAO.addDecimals(amount)], infoArgs: {amount}}
    ])
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
