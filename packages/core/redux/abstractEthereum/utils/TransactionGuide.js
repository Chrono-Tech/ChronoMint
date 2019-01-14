/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { blockchainScopeSelector } from '../selectors'

export default class TransactionGuide {
  constructor (blockchain) {
    this.blockchainScopeSelector = blockchainScopeSelector(blockchain)
  }

  estimateGas = (tx, feeMultiplier) => async (dispatch, getState) => {
    const { gasLimit, gasPrice } = await this.getGasData(dispatch, this.getWeb3(getState()), tx, feeMultiplier)
    const gasFee = gasPrice.mul(gasLimit)
    return { gasLimit, gasFee, gasPrice }
  }

  getGasData = async (dispatch, web3, tx, feeMultiplier) => {
    const nonce = await dispatch(this.nextNonce({ web3, address: tx.from }))
    const gasPrice = new BigNumber(await web3.eth.getGasPrice()).mul(feeMultiplier || 1)
    const chainId = await web3.eth.net.getId()
    const gasLimit = await web3.eth.estimateGas(this.getEstimateGasRequestFieldSet(tx, gasPrice, nonce, chainId))
    return { chainId, gasLimit, gasPrice, nonce }
  }

  nextNonce = ({ web3, address }) => async (dispatch, getState) => {
    const addr = address.toLowerCase()
    const state = this.blockchainScopeSelector(getState())

    return Math.max(
      (addr in state.nonces) ? state.nonces[addr] : 0,
      await web3.eth.getTransactionCount(addr, 'pending'),
    )
  }

  getEstimateGasRequestFieldSet (tx, gasPrice, nonce) {
    return {
      from: tx.from,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      gasPrice,
      nonce,
    }
  }
}
