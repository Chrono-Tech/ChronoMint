import BigNumber from 'bignumber.js'
import AbstractContractDAO from './AbstractContractDAO'
import contractsManagerDAO from './ContractsManagerDAO'
import type ERC20DAO from './ERC20DAO'
import resultCodes from 'chronobank-smart-contracts/common/errors'

export const TX_DEPOSIT = 'deposit'
export const TX_WITHDRAW_SHARES = 'withdrawShares'

export const TIME = 'TIME'

export default class TIMEHolderDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/TimeHolder.json'), at)

    // TODO @dkchv: remove all except OK after SC update and backend research, see MINT-279
    // cause TIMEHOLDER_DEPOSIT_FAILED and TIMEHOLDER_WITHDRAWN_FAILED
    // - is like warning, not error, backend says
    /** @namespace resultCodes.TIMEHOLDER_DEPOSIT_FAILED */
    /** @namespace resultCodes.TIMEHOLDER_WITHDRAWN_FAILED */
    this._okCodes = [
      resultCodes.OK,
      resultCodes.TIMEHOLDER_DEPOSIT_FAILED,
      resultCodes.TIMEHOLDER_WITHDRAWN_FAILED
    ]
  }

  async getAssetDAO (): Promise<ERC20DAO> {
    const assetAddress = await this._call('sharesContract')
    return contractsManagerDAO.getERC20DAO(assetAddress)
  }

  async deposit (amount: BigNumber) {
    const assetDAO = await this.getAssetDAO()
    return this._tx(TX_DEPOSIT, [assetDAO.addDecimals(amount)], {amount})
  }

  async withdraw (amount: BigNumber) {
    const assetDAO = await this.getAssetDAO()
    return this._tx(TX_WITHDRAW_SHARES, [assetDAO.addDecimals(amount)], {amount})
  }

  async getAccountDepositBalance (account = this.getAccount()): BigNumber {
    const assetDAO = await this.getAssetDAO()
    return this._call('depositBalance', [account]).then(r => assetDAO.removeDecimals(r))
  }
}
