/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import ethAbi from 'ethereumjs-abi'
import BN from 'bn.js'
import Web3ABI from 'web3-eth-abi'
import { cloneDeepWith, zipWith } from 'lodash'
import { Amount } from '../../models'

export class TransactionDescriber {
  constructor (abi, describe) {
    this.abi = abi
    this.describe = describe
    this.topic = Web3ABI.encodeFunctionSignature(abi)
    Object.freeze(this)
  }
}

export const decodeParameters = (abi, tx) => {
  const inputsBody = tx.input.substring(10)
  const names = abi.inputs ? abi.inputs.map((x) => x.name) : []
  const types = abi.inputs ? abi.inputs.map((x) => x.type) : []
  const inputsBuf = Buffer.from(inputsBody, `hex`)
  const values = ethAbi.rawDecode(types, inputsBuf, [])

  const items = zipWith(names, types, values).map(([name, type, value]) => ({
    name,
    type,
    value: cloneDeepWith(
      value,
      (node) => {
        if (node instanceof BN) {
          return new BigNumber(node.toString())
        }
        if (typeof node === 'string' || node instanceof String) {
          if (type.indexOf('address') === 0) {
            return `0x${node}`
          }
        }
        if (node instanceof Uint8Array) {
          if (type.indexOf('bytes32') === 0) {
            return `0x${node.toString('hex')}`
          }
        }
      },
    ),
  }))

  return {
    inputs: items.map((item) => ({
      input: item.name,
      value: item.value,
    })),
    params: items.reduce((target, item) => {
      target[item.name] = item.value
      return target
    }, {}),
  }
}

export const findFunctionABI = (abi, name) => {
  return abi.abi.find((entry) => entry.type === 'function' && entry.name === name)
}

// Helper functions

export function ethFeeInfo ({ tx, receipt }, { address, symbol }) {
  const fee = new BigNumber(tx.gasPrice).mul(receipt ? receipt.cumulativeGasUsed : tx.gasLimit)

  if (tx.from.toLowerCase() === address) {
    return {
      amount: new Amount(fee.mul(-1), symbol),
      amountTitle: 'Fee',
    }
  }
  return {
    amount: null,
    amountTitle: null,
  }
}
