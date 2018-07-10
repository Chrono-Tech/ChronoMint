/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import TokenModel from '../../../models/tokens/TokenModel'
import AbstractTokenDAO from './AbstractTokenDAO'
import ERC20DAODefaultABI from '../../../dao/abi/ERC20DAODefaultABI'
import TxExecModel from '../../models/TxExecModel'
import { TX_TRANSFER } from '../../../dao/EthereumDAO'
import Amount from '../../../models/Amount'

export const DEFAULT_GAS = 4700000
export default class ERC20TokenDAO extends AbstractTokenDAO {
  constructor (token: TokenModel, abi) {
    super(token)
    this.abi = abi || ERC20DAODefaultABI
  }

  async connect (web3, options): Promise<TokenModel> {
    if (this.isConnected) {
      this.disconnect()
    }
    // eslint-disable-next-line no-console
    console.log('[ERC20TokenDAO] Connect')
    this.contract = new web3.eth.Contract(this.abi.abi, this.token.address(), options)

    const [
      name,
      symbol,
      decimals,
    ] = await Promise.all([
      this.getName(),
      this.getSymbol(),
      this.getDecimals(),
    ])

    this.token = new TokenModel({
      id: this.token.id,
      name,
      address: this.token.address(),
      symbol,
      decimals,
    })

    this.transferEmitter = this.contract.events.Transfer({})
      .on('data', this.handleTransferData.bind(this))
      .on('changed', this.handleTransferChanged.bind(this))
      .on('error', this.handleTransferError.bind(this))
    this.approvalEmitter = this.contract.events.Approval({})
      .on('data', this.handleApprovalData.bind(this))
      .on('changed', this.handleApprovalChanged.bind(this))
      .on('error', this.handleApprovalError.bind(this))

    return this.token
  }

  disconnect () {
    if (this.isConnected) {
      this.transferEmitter.removeAllListeners()
      this.approvalEmitter.removeAllListeners()
      this.transferEmitter = null
      this.approvalEmitter = null
      this.contract = null
    }
  }

  async getName (): Promise<String> {
    return this.contract.methods.symbol().call()
  }

  async getSymbol (): Promise<String> {
    return this.contract.methods.symbol().call()
  }

  async getDecimals (): Promise<Number> {
    const response = await this.contract.methods.decimals().call()
    return Number(response.toString())
  }

  get isConnected () {
    return this.contract != null // nil check
  }

  get isDepositSupported () {
    return false
  }

  get isWithdrawSupported () {
    return false
  }

  get isTradeSupported () {
    return true
  }

  get isTransferSupported () {
    return true
  }

  get isApproveSupported () {
    return true
  }

  /**
   * getting balance for eth address
   * @param address {string}
   * @returns {Promise<BigNumber>}
   */
  async getAccountBalance (address) {
    return new BigNumber(await this.contract.methods.balanceOf(address).call())
  }

  /**
   * getting allowance
   * @param owner {string}
   * @param spender {string}
   * @returns {Promise<BigNumber>}
   */
  async getAccountAllowance (owner, spender) {
    return new BigNumber(await this.contract.methods.allowance(owner, spender).call())
  }

  createTransferTx (sender, recipient, amount) {
    const data = this.contract.methods.transfer(recipient, amount).encodeABI()
    return {
      from: sender,
      to: this.token.address(),
      data,
    }
  }

  createApproveTx (owner, spender, amount) {
    const data = this.contract.methods.approve(spender, amount).encodeABI()
    const tx = {
      from: owner,
      to: this.token.address(),
      data,
    }
    return tx
  }

  handleTransferData (data) {
    // eslint-disable-next-line no-console
    console.log('[ERC20TokenDAO] Transfer occurred', data)
    const { returnValues } = data
    setImmediate(() => {
      this.emit('transfer', {
        key: `${data.transactionHash}/${data.logIndex}`,
        token: this.token,
        // eslint-disable-next-line no-underscore-dangle
        from: returnValues._from,
        // eslint-disable-next-line no-underscore-dangle
        to: returnValues._to,
        // eslint-disable-next-line no-underscore-dangle
        value: new BigNumber(returnValues._value),
      })
    })
  }

  handleTransferChanged (event) {
    // eslint-disable-next-line no-console
    console.warning('[ERC20TokenDAO] Transfer event changed', event)
  }

  handleTransferError (error) {
    // eslint-disable-next-line no-console
    console.error('[ERC20TokenDAO] Error in Transfer event subscription', error)
  }

  handleApprovalData (data) {
    // eslint-disable-next-line no-console
    console.log('[ERC20TokenDAO] Approve occurred', data)
    const { returnValues } = data
    setImmediate(() => {
      this.emit('approval', {
        key: `${data.transactionHash}/${data.logIndex}`,
        token: this.token,
        // eslint-disable-next-line no-underscore-dangle
        owner: returnValues._owner,
        // eslint-disable-next-line no-underscore-dangle
        spender: returnValues._spender,
        // eslint-disable-next-line no-underscore-dangle
        value: new BigNumber(returnValues._value),
      })
    })
  }

  handleApprovalChanged (event) {
    // eslint-disable-next-line no-console
    console.warning('[ERC20TokenDAO] Approval event changed', event)
  }

  handleApprovalError (error) {
    // eslint-disable-next-line no-console
    console.error('[ERC20TokenDAO] Error in Approval event subscription', error)
  }

  /**
   * Create a tx execute model
   * @param from {string} - address from
   * @param to {string}  - address to
   * @param amount {Amount} - amount of tokens
   * @param feeMultiplier {number} - multiplier for gas price
   * @param advancedOptions {object} - other options, maybe useless
   * @returns {TxExecModel}
   */
  transfer (from: string, to: string, amount: Amount, feeMultiplier: Number = 1, advancedOptions = undefined): TxExecModel {
    const data = this.contract.methods.transfer(to, amount).encodeABI()
    const advancedParams = advancedOptions && typeof advancedOptions === 'object' ? advancedOptions : {}
    advancedParams.feeMultiplier = feeMultiplier

    return {
      func: 'transfer',
      args: [],
      from,
      to,
      feeMultiplier,
      value: new BigNumber(0),
      data,
    }
  }

  getEstimateGasParams = async (tx): number | Object => {
    return { to: tx.to, value: tx.value }
    // TODO @abdulov change the method
    // const { func, args = [], value = null, from } = tx
    //
    // const deployed = await this.contract
    // if (!deployed.hasOwnProperty(func)) {
    //   throw this._error('estimateGas func not found', func)
    // }
    //
    // const estimatedGas = deployed[func].estimateGas(...args, {
    //   from,
    //   value,
    //   gas: DEFAULT_GAS,
    // })
    // return estimatedGas

  }
}
