/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import Amount from '../models/Amount'
import TokenModel from '../models/tokens/TokenModel'
import TxModel from '../models/TxModel'
import { TXS_PER_PAGE } from '../models/wallet/TransactionsCollection'
import ERC20DAODefaultABI from './abi/ERC20DAODefaultABI'
import AbstractTokenDAO from './AbstractTokenDAO'

//#region CONSTANTS

import {
  TX_TRANSFER,
} from './constants/ERC20DAO'
import {
  BLOCKCHAIN_ETHEREUM,
  EVENT_APPROVAL_TRANSFER,
  EVENT_NEW_TRANSFER,
} from './constants'

//#endregion CONSTANTS

const EVENT_TRANSFER = 'Transfer'
const EVENT_APPROVAL = 'Approval'

export default class ERC20DAO extends AbstractTokenDAO {
  constructor (token: TokenModel, abi) {
    super(abi || ERC20DAODefaultABI, token.address())
    this.abi = abi || ERC20DAODefaultABI
    this.token = token
    if (token.decimals() > 20) {
      throw new Error(`decimals for token ${token.id()} must be lower than 20`)
    }
    this._decimals = token.decimals()
    this._symbol = token.symbol()
  }

  async connect (web3, options): Promise<TokenModel> {
    if (this.isConnected) {
      this.disconnect()
    }
    this.contract = new web3.eth.Contract(this.abi.abi, this.getInitAddress(), options)

  }

  disconnect () {
    if (this.isConnected) {
      // this.transferEmitter.removeAllListeners()
      // this.approvalEmitter.removeAllListeners()
      // this.transferEmitter = null
      // this.approvalEmitter = null
      this.contract = null
    }
  }

  get isConnected () {
    return this.contract != null // nil check
  }

  /**
   * @deprecated
   */
  getSymbol () {
    return this._symbol
  }

  getSymbolFromContract () {
    return this.contract.methods.symbol().call()
  }

  getDecimalsFromContract () {
    return this.contract.methods.decimals().call()
  }

  addDecimals (amount: BigNumber): BigNumber {
    if (this._decimals === null) {
      throw new Error('addDecimals: decimals is undefined')
    }
    const amountBN = new BigNumber(amount)
    return amountBN.mul(Math.pow(10, this._decimals))
  }

  removeDecimals (amount: BigNumber): BigNumber {
    const amountBN = new BigNumber(amount)
    return amountBN.div(Math.pow(10, this._decimals))
  }

  totalSupply (): Promise {
    return this.contract.methods.totalSupply().call()
  }

  getAccountBalance (address): Promise {
    return this.contract.methods.balanceOf(address).call()
  }

  getAccountAllowance (account, spender): Promise {
    return this.contract.methods.allowance(account, spender).call()
  }

  approve (account: string, amount: Amount, feeMultiplier: Number = 1, advancedOptions = undefined): Promise {
    return this._tx('approve', [
      account,
      new BigNumber(amount),
    ], {
      account,
      amount,
      currency: amount.symbol(),
    }, new BigNumber(0), {
      feeMultiplier,
      advancedOptions,
    })
  }

  revoke (account: string, symbol: string, feeMultiplier: Number = 1, advancedOptions = undefined): Promise {
    return this._tx('approve', [
      account,
      new BigNumber(0),
    ], {
      account,
      revoke: true,
      currency: symbol,
    }, new BigNumber(0), {
      feeMultiplier,
      advancedOptions,
    })
  }

  transfer (from: string, to: string, amount: Amount, token: TokenModel, feeMultiplier: Number = 1, advancedOptions = undefined): Promise {
    return this._tx(TX_TRANSFER, [
      to,
      new BigNumber(amount),
    ], {
      from,
      to,
      amount,
      currency: amount.symbol(),
    }, new BigNumber(0), {
      feeMultiplier,
      from,
      advancedOptions,
    })
  }

  /** @private */
  _createTxModel (tx, accounts, block, time): TxModel {
    const gasPrice = new BigNumber(tx.gasPrice)
    const gasFee = gasPrice.mul(tx.gas)

    return new TxModel({
      txHash: tx.transactionHash,
      blockHash: tx.blockHash,
      blockNumber: block,
      transactionIndex: tx.transactionIndex,
      from: tx.args.from,
      to: tx.args.to,
      symbol: this._symbol,
      value: new Amount(tx.args.value, this._symbol),
      gas: tx.gas,
      gasPrice,
      gasFee,
      time,
      token: this.getInitAddress(),
      blockchain: BLOCKCHAIN_ETHEREUM,
    })
  }

  /** @private */
  async _getTxModel (tx, accounts, block = null, time = null): Promise<?TxModel> {
    if (!tx.args.value) {
      return null
    }

    const txDetails = await this._web3Provider.getTransaction(tx.transactionHash)
    tx.gasPrice = txDetails.gasPrice
    tx.gas = txDetails.gas

    if (block && time) {
      return this._createTxModel(tx, accounts, block, time)
    }
    const minedBlock = await this._web3Provider.getBlock(tx.blockHash)
    return this._createTxModel(tx, accounts, tx.blockNumber, minedBlock.timestamp)
  }

  watch (accounts: Array<string>): Promise {
    // return Promise.all([
    //   this.watchTransfer(accounts),
    //   this.watchApproval(accounts),
    // ])
  }

  watchApproval (accounts) {
    return this._watch(EVENT_APPROVAL, (result) => {
      this.emit(EVENT_APPROVAL_TRANSFER, result.args)
    }, { from: accounts })
  }

  async watchTransfer (accounts) {
    const internalCallback = async (result, block, time) => {
      const tx = await this._getTxModel(result, accounts, block, time / 1000)
      if (tx) {
        this.emit(EVENT_NEW_TRANSFER, tx)
      }
    }
    await Promise.all([
      this._watch(EVENT_TRANSFER, internalCallback, { from: accounts }),
      this._watch(EVENT_TRANSFER, internalCallback, { to: accounts }),
    ])
  }

  async getTransfer (id, account): Promise<Array<TxModel>> {
    const [result, result2] = await Promise.all([
      this._get(EVENT_TRANSFER, 0, 'latest', { from: account }, TXS_PER_PAGE, `${id}-in`),
      this._get(EVENT_TRANSFER, 0, 'latest', { to: account }, TXS_PER_PAGE, `${id}-out`),
    ])

    const callback = (tx) => promises.push(this._getTxModel(tx, account))
    const promises = []
    result.forEach(callback)
    result2.forEach(callback)

    return Promise.all(promises)
  }

}
