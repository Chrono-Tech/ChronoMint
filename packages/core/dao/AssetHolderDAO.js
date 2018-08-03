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

  async deposit (token, amount: Amount, feeMultiplier: Number = 1, advancedOptions = undefined) {
    return this._tx(TX_DEPOSIT, [
      token.address(),
      new BigNumber(amount),
    ], amount, new BigNumber(0), {
      feeMultiplier,
      advancedOptions,
      from: advancedOptions && advancedOptions.account,
      symbol: token.symbol(),
      blockchain: token.blockchain(),
      fields: {
        amount: {
          value: amount,
          description: 'amount',
        },
      },
    })
  }

  shareholdersCount (): Promise {
    return this.contract.methods.defaultShareholdersCount().call()
  }

  async withdraw (token, amount: Amount, feeMultiplier: Number = 1, advancedOptions = undefined) {
    return this._tx(TX_WITHDRAW_SHARES, [
      token.address(),
      new BigNumber(amount),
    ], amount, new BigNumber(0), {
      feeMultiplier,
      advancedOptions,
      from: advancedOptions && advancedOptions.account,
      symbol: token.symbol(),
      blockchain: token.blockchain(),
      fields: {
        amount: {
          value: amount,
          description: 'withdraw',
          mark: 'plus',
        },
      },
    })
  }

  getDeposit (tokenAddress: String, account: String): Promise {
    return this.contract.methods.getDepositBalance(tokenAddress, account).call()
  }
}
