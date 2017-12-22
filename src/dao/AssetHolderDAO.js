import Amount from 'models/Amount'
import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import tokenService from 'services/TokenService'
import { AssetHolderABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'
import type ERC20DAO from './ERC20DAO'

export const TX_DEPOSIT = 'deposit'
export const TX_WITHDRAW_SHARES = 'withdrawShares'

export const TIME = 'TIME'

export default class AssetHolderDAO extends AbstractContractDAO {
  constructor (at) {
    super(AssetHolderABI, at)
    this._okCodes = [
      resultCodes.OK,
      resultCodes.TIMEHOLDER_DEPOSIT_FAILED,
      resultCodes.TIMEHOLDER_WITHDRAWN_FAILED,
    ]
  }

  async getSharesContract (): Promise {
    return this._call('sharesContract')
  }

  async getAssetDAO (): Promise<ERC20DAO> {
    const assetAddress = await this.getSharesContract()
    console.log('--AssetHolderDAO#getAssetDAO', assetAddress)
    return tokenService.getDAO(assetAddress)
  }

  getWalletAddress (): Promise {
    return this._call('wallet')
  }

  async deposit (amount: Amount) {
    return this._tx(TX_DEPOSIT, [
      new BigNumber(amount),
    ], {
      amount,
    })
  }

  shareholdersCount (): Promise {
    return this._call('shareholdersCount')
  }

  async withdraw (amount: BigNumber) {
    return this._tx(TX_WITHDRAW_SHARES, [
      new BigNumber(amount),
    ], { amount })
  }

  getDeposit (account): Promise {
    return this._call('depositBalance', [ account ])
  }

  /**
   * @deprecated
   */
  async getAccountDepositBalance (account = this.getAccount()): BigNumber {
    const [ assetDAO, depositBalance ] = await Promise.all([
      this.getAssetDAO(),
      this._call('depositBalance', [ account ]),
    ])
    return assetDAO.removeDecimals(depositBalance)
  }
}
