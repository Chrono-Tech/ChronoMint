/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import TokenModel from '../models/tokens/TokenModel'
import AbstractTokenDAO from './AbstractTokenDAO'
import ERC20DAODefaultABI from './abi/ERC20DAODefaultABI'
import Amount from '../models/Amount'

export const DEFAULT_GAS = 4700000
export default class ERC20TokenDAO extends AbstractTokenDAO {
  constructor (token: TokenModel, abi) {
    super(token)
    this.token = token
    this.abi = abi || ERC20DAODefaultABI
  }

  async connect (web3, options): Promise<TokenModel> {
    if (this.isConnected) {
      this.disconnect()
    }
    this.contract = new web3.eth.Contract(this.abi.abi, this.token.address(), options)
    this.web3 = web3

    this.allEventsEmitter = this.contract.events.allEvents({})
      .on('data', this.handleAllEventsData)
      .on('error', this.handleTransferError)
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

  handleAllEventsData = (data) => {
    switch (`${data.event}`.toLowerCase()) {
      case 'transfer':
        this.handleTransferData(data)
        break
      case 'approval':
        this.handleApprovalData(data)
        break
    }
  }

  handleTransferError = (e) => {
    // eslint-disable-next-line
    console.log('Transfer event error: ', e)
  }

  handleTransferData (data) {
    const { returnValues } = data
    setImmediate(() => {
      this.emit('transfer', {
        key: `${data.transactionHash}/${data.logIndex}`,
        token: this.token,
        // eslint-disable-next-line no-underscore-dangle
        from: returnValues.from.toLowerCase(),
        // eslint-disable-next-line no-underscore-dangle
        to: returnValues.to.toLowerCase(),
        value: new BigNumber(returnValues.value),
      })
    })
  }

  handleApprovalData (data) {
    const { returnValues } = data
    setImmediate(() => {
      this.emit('approval', {
        key: `${data.transactionHash}/${data.logIndex}`,
        token: this.token,
        owner: returnValues.from.toLowerCase(),
        spender: returnValues.spender.toLowerCase(),
        value: new BigNumber(returnValues.value),
      })
    })
  }

  /**
   * Create a tx execute model
   * @param from
   * @param to
   * @param amount
   * @returns {{from: string, to: *, value: BigNumber, data: string}}
   */
  transfer (from: string, to: string, amount: Amount): Promise {
    const data = this.contract.methods.transfer(to, amount).encodeABI()
    return {
      from,
      to: this.contract._address,
      value: new BigNumber(0),
      data,
    }
  }

  /**
   * Approve some tokens
   * @param spender - string
   * @param amount - Amount
   * @param from - string
   * @returns {{from: string, to: string, value: BigNumber, data: string}}
   */
  approve (spender: string, amount: Amount, from: string) {
    const data = this.contract.methods.approve(spender, amount).encodeABI()
    return {
      from,
      to: this.contract._address.toLowerCase(),
      value: new BigNumber(0),
      data,
    }
  }

  revoke (spender: string, symbol: string, from) {
    const data = this.contract.methods.approve(spender, new Amount(0, symbol)).encodeABI()

    return {
      from,
      to: this.contract._address.toLowerCase(),
      value: new BigNumber(0),
      data,
    }
  }

  estimateGas = async (func, args, value, from, additionalOptions): Object => {
    const feeMultiplier = additionalOptions ? additionalOptions.feeMultiplier : 1

    const contract = await this.contract
    if (!contract.methods.hasOwnProperty(func)) {
      throw this._error(`estimateGas func ${func} not found`)
    }

    const [gasPrice, gasLimit] = await Promise.all([
      this.web3.eth.getGasPrice(),
      contract.methods[func](...args).estimateGas({ from, value, gas: DEFAULT_GAS }),
    ])

    const gasPriceBN = new BigNumber(gasPrice).mul(feeMultiplier)
    const gasFeeBN = gasPriceBN.mul(gasLimit)
    const gasLimitBN = new BigNumber(gasLimit)

    return { gasLimit: gasLimitBN, gasFee: gasFeeBN, gasPrice: gasPriceBN }
  }
}
