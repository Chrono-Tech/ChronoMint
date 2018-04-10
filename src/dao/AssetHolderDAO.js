/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

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
    return this._call('getDefaultShares')
  }

  async getAssetDAO (): Promise<ERC20DAO> {
    const assetAddress = await this.getSharesContract()
    // eslint-disable-next-line
    console.log('--AssetHolderDAO#getAssetDAO', assetAddress)
    return tokenService.getDAO(assetAddress)
  }

  getWalletAddress (): Promise {
    return this._call('wallet')
  }

  async deposit (tokenAddress: String, amount: Amount) {
    return this._tx(TX_DEPOSIT, [
      tokenAddress,
      new BigNumber(amount),
    ], {
      amount,
    })
  }

  shareholdersCount (): Promise {
    return this._call('defaultShareholdersCount')
  }

  async withdraw (tokenAddress: String, amount: Amount) {
    return this._tx(TX_WITHDRAW_SHARES, [
      tokenAddress,
      new BigNumber(amount),
    ], { amount })
  }

  getDeposit (tokenAddress: String, account: String): Promise {
    return this._call('getDepositBalance', [ tokenAddress, account ])
  }
}
