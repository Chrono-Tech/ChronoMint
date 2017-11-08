import BigNumber from 'bignumber.js'
import TimeHolderABI from 'chronobank-smart-contracts/build/contracts/TimeHolder.json'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import AbstractContractDAO from './AbstractContractDAO'
import contractsManagerDAO from './ContractsManagerDAO'
import type ERC20DAO from './ERC20DAO'

export const TX_DEPOSIT = 'deposit'
export const TX_WITHDRAW_SHARES = 'withdrawShares'

export const TIME = 'TIME'

export default class TIMEHolderDAO extends AbstractContractDAO {
  constructor (at) {
    super(TimeHolderABI, at)
    /** @namespace resultCodes.TIMEHOLDER_DEPOSIT_FAILED */
    /** @namespace resultCodes.TIMEHOLDER_WITHDRAWN_FAILED */
    this._okCodes = [
      resultCodes.OK,
      resultCodes.TIMEHOLDER_DEPOSIT_FAILED,
      resultCodes.TIMEHOLDER_WITHDRAWN_FAILED,
    ]
  }

  async getAssetDAO (): Promise<ERC20DAO> {
    const assetAddress = await this._call('sharesContract')
    return contractsManagerDAO.getERC20DAO(assetAddress)
  }

  getWalletAddress () {
    return this._call('wallet')
  }

  async deposit (amount: BigNumber) {
    const assetDAO = await this.getAssetDAO()
    return this._tx(TX_DEPOSIT, [assetDAO.addDecimals(amount)], { amount })
  }

  shareholdersCount () {
    return this._call('shareholdersCount')
  }

  async withdraw (amount: BigNumber) {
    const assetDAO = await this.getAssetDAO()
    return this._tx(TX_WITHDRAW_SHARES, [assetDAO.addDecimals(amount)], { amount })
  }

  async getAccountDepositBalance (account = this.getAccount()): BigNumber {
    const [assetDAO, depositBalance] = await Promise.all([
      this.getAssetDAO(),
      this._call('depositBalance', [account]),
    ])
    return assetDAO.removeDecimals(depositBalance)
  }
}
