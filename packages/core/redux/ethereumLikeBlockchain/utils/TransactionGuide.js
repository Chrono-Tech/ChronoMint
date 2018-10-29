/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import autobind from 'autobind-decorator'
import BigNumber from 'bignumber.js'

import { estimateTxGas } from '../utils'

export default class TransactionGuide {
  constructor (duckId) {
    this.duckId = duckId
  }

  @autobind
  estimateGas (tx, feeMultiplier) {
    return (
      async (dispatch, getState) => {
        // eslint-disable-next-line no-console
        console.log(getState(), getState().toJS())
        const web3 = this.getWeb3(getState())
        // eslint-disable-next-line no-console
        console.log(web3)
        const nonce = await dispatch(this.nextNonce({ web3, address: tx.from }, this.duckId))
        const gasPrice = new BigNumber(await web3.eth.getGasPrice()).mul(feeMultiplier)
        const chainId = await web3.eth.net.getId()
        const gasLimit = await estimateTxGas(web3, this.getEstimateGasRequestFieldSet(tx, gasPrice, nonce, chainId))
        const gasFee = gasPrice.mul(gasLimit)

        return {
          gasLimit,
          gasFee,
          gasPrice,
        }
      }
    )
  }

  @autobind
  nextNonce ({ web3, address }) {
    return (
      async (dispatch, getState) => {
        const addr = address.toLowerCase()
        const state = getState().get(this.duckId)

        return Math.max(
          (addr in state.nonces) ? state.nonces[addr] : 0,
          await web3.eth.getTransactionCount(addr, 'pending'),
        )
      }
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
