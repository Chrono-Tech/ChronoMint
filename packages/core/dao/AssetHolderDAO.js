/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import tokenService from '../services/TokenService'
import type ERC20DAO from './ERC20DAO'
import Amount from '../models/Amount'

export const TX_DEPOSIT = 'deposit'
export const TX_WITHDRAW_SHARES = 'withdrawShares'

export const TIME = 'TIME'

export default class AssetHolderDAO {
  constructor ({ address, history, abi }) {
    this.address = address
    this.history = history
    this.abi = abi

    this._okCodes = [
      resultCodes.OK,
      resultCodes.TIMEHOLDER_DEPOSIT_FAILED,
      resultCodes.TIMEHOLDER_WITHDRAWN_FAILED,
    ]
  }

  connect (web3, options) {
    if (this.isConnected) {
      this.disconnect()
    }
    // eslint-disable-next-line no-console
    console.log(`[${this.constructor.name}] Connect`)
    this.contract = new web3.eth.Contract(this.abi.abi, this.address, options)
    console.log('AssetHolderDAO connected')
    this.history = this.history != null // nil check
      ? new web3.eth.Contract(this.abi.abi, this.history, options)
      : this.contract
  }

  get isConnected () {
    return this.contract != null
  }

  disconnect () {
    if (this.isConnected) {
      this.contract = null
      this.history = null
    }
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

  async deposit (tokenAddress: String, amount: Amount, feeMultiplier: Number = 1, advancedOptions = undefined) {
    return this._tx(TX_DEPOSIT, [
      tokenAddress,
      new BigNumber(amount),
    ], {
      amount,
    }, new BigNumber(0), {
      feeMultiplier,
      advancedOptions,
    })
  }

  shareholdersCount (): Promise {
    return this.contract.methods.defaultShareholdersCount().call()
  }

  async withdraw (tokenAddress: String, amount: Amount, feeMultiplier: Number = 1, advancedOptions = undefined) {
    return this._tx(TX_WITHDRAW_SHARES, [
      tokenAddress,
      new BigNumber(amount),
    ], {
      amount,
    }, new BigNumber(0), {
      feeMultiplier,
      advancedOptions,
    })
  }

  getDeposit (tokenAddress: String, account: String): Promise {
    return this.contract.methods.getDepositBalance(tokenAddress, account).call()
  }
}
