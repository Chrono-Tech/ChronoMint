/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import tokenService from '../services/TokenService'
import AbstractContractDAO from './AbstractContract3DAO'
import type ERC20DAO from './ERC20DAO'
import Amount from '../models/Amount'

//#region CONSTANTS

import {
  TX_DEPOSIT,
  TX_WITHDRAW_SHARES,
} from './constants/AssetHolderDAO'

//#endregion CONSTANTS

export default class AssetHolderDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })

    this._okCodes = [
      resultCodes.OK,
      resultCodes.TIMEHOLDER_DEPOSIT_FAILED,
      resultCodes.TIMEHOLDER_WITHDRAWN_FAILED,
    ]
  }

  connect (web3, options) {
    super.connect(web3, options)
  }

  async getSharesContract (): Promise {
    return this.contract.methods.getDefaultShares().call()
  }

  async getAssetDAO (): Promise<ERC20DAO> {
    const assetAddress = await this.getSharesContract()
    return tokenService.getDAO(assetAddress)
  }

  getWalletAddress (): Promise {
    return this.contract.methods.wallet().call()
  }

  deposit (tokenAddress, amount: Amount, from) {
    return this._tx(
      TX_DEPOSIT,
      [
        tokenAddress,
        new BigNumber(amount),
      ],
      new BigNumber(0),
      from,
    )
  }

  shareholdersCount (): Promise {
    return this.contract.methods.defaultShareholdersCount().call()
  }

  withdraw (tokenAddress, amount: Amount, from) {
    return this._tx(
      TX_WITHDRAW_SHARES,
      [
        tokenAddress,
        new BigNumber(amount),
      ],
      new BigNumber(0),
      from,
    )
  }

  getDeposit (tokenAddress: String, account: String): Promise {
    return this.contract.methods.getDepositBalance(tokenAddress, account).call()
  }
}
