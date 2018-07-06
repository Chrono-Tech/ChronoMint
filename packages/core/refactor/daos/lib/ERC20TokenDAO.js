/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import TokenModel from '../../../models/tokens/TokenModel'
import AbstractTokenDAO from './AbstractTokenDAO'

export default class ERC20TokenDAO extends AbstractTokenDAO {
  constructor (token: TokenModel, abi) {
    super(token)
    this.abi = abi
  }

  async connect (web3, options): Promise<TokenModel> {
    if (this.isConnected) {
      this.disconnect()
    }
    // eslint-disable-next-line no-console
    console.log('[ERC20TokenDAO] Connect')
    this.contract = new web3.eth.Contract(this.abi.abi, this.token.address, options)

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
      key: this.token.key,
      name,
      address: this.token.address,
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

  async getBalance (address) {
    return new BigNumber(await this.contract.methods.balanceOf(address).call())
  }

  async getAllowance (owner, spender) {
    return new BigNumber(await this.contract.methods.allowance(owner, spender).call())
  }

  createTransferTx (sender, recipient, amount) {
    const data = this.contract.methods.transfer(recipient, amount).encodeABI()
    return {
      from: sender,
      to: this.token.address,
      data,
    }
  }

  createApproveTx (owner, spender, amount) {
    const data = this.contract.methods.approve(spender, amount).encodeABI()
    const tx = {
      from: owner,
      to: this.token.address,
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
}
