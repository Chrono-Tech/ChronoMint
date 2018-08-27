/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import Web3ABI from 'web3-eth-abi'
import { Amount, LogTxModel } from '../models'
import LogEventModel from '../models/describers/LogEventModel'
import { EVENT_DESCRIBERS_BY_TOPIC, decodeLog } from './events'
import { TRANSACTION_DESCRIBERS_BY_TOPIC, decodeParameters, findFunctionABI } from './transactions'
import { decodeTxData } from '../utils/DecodeUtils'
import { ETH, XEM } from '../dao/constants'

export const describeEvent = (data, context = {}) => {
  const { log, block } = data

  const array = EVENT_DESCRIBERS_BY_TOPIC[log.topics[0]]
  if (array) {
    for (const describer of array) {
      const { input, params } = decodeLog(describer.abi, log)
      const desc = describer.describe(data, context, { abi: describer.abi, input, params })
      if (desc) {
        return desc
      }
    }
  }

  return new LogEventModel({
    key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
    name: 'custom',
    date: new Date(block.timestamp * 1000),
    icon: 'event',
    title: 'Custom event',
    message: `${log.address}`,
    target: null,
    amount: null,
  })
}

const formatPendingTxData = ({ abi, tx }) => {
  const data = abi != null && tx.data != null
    ? decodeTxData(abi.abi, tx.data)
    : (tx.data != null ? { name: 'Unknown contract' } : null)

  if (data) {
    const params = data.params.reduce((accumulator, entry) => ({ ...accumulator, [entry.name]: entry.value }), {})
    return {
      params,
      inputs: data.inputs,
      topic: Web3ABI.encodeFunctionSignature(findFunctionABI(abi, data.name)),
    }
  }
  return {}
}

const defaultDescription = (entry, context) => {
  const { tx, receipt, block } = entry
  const address = context.address.toLowerCase()

  const v = new BigNumber(tx.value)
  const fee = new BigNumber(tx.gasPrice).mul(receipt ? receipt.cumulativeGasUsed : tx.gasLimit)

  let value = null
  if (tx.from.toLowerCase() === address && tx.to.toLowerCase() === address) {
    value = fee.mul(-1)
  } else if (tx.from.toLowerCase() === address) {
    value = v.minus(fee)
  } else {
    value = v
  }

  const amount = new Amount(value, ETH)
  const path = `tx`
  return new LogTxModel({
    key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
    type: 'tx',
    name: 'custom',
    date: new Date(block ? (block.timestamp * 1000) : null),
    icon: 'event',
    title: `Unknown transaction`,
    message: tx.to,
    target: null,
    fields: [
      {
        value: tx.from,
        description: `${path}.from`,
      },
      {
        value: tx.to,
        description: `${path}.to`,
      },
      {
        value: amount,
        description: `${path}.amount`,
      },
    ],
  })
}

export const describePendingTx = (entry, context = {}) => {
  const { tx } = entry
  const { abi } = context

  if (!abi) {
    return defaultDescription(entry, context)
  }

  const info = formatPendingTxData({ abi, tx })

  const array = TRANSACTION_DESCRIBERS_BY_TOPIC[info.topic]
  if (array) {
    for (const describer of array) {
      const desc = describer.describe(
        entry,
        context,
        {
          inputs: info.inputs,
          params: info.params,
          ...context,
          abi: describer.abi
        }
      )

      if (desc) {
        return desc
      }
    }
  }

  return defaultDescription(entry, context)
}

export const describeTx = (entry, context = {}) => {
  const { tx } = entry

  const array = TRANSACTION_DESCRIBERS_BY_TOPIC[tx.input.substr(0, 10)]
  if (array) {
    for (const describer of array) {
      const { inputs, params } = decodeParameters(describer.abi, entry.tx)
      const desc = describer.describe(
        entry,
        context,
        {
          inputs,
          params,
          ...context,
          abi: describer.abi,
        }
      )

      if (desc) {
        return desc
      }
    }
  }

  return defaultDescription(entry, context)
}

export const describePendingNemTx = (entry, context = {}) => {
  const { tx, block } = entry
  const { token } = context
  const { prepared } = tx

  const fee = new Amount(prepared.fee, XEM)

  const amount = prepared.mosaics
    ? new Amount(prepared.mosaics[0].quantity, token.symbol())
    : new Amount(prepared.amount, token.symbol()) // we can send only one mosaic

  const path = `tx.nem.transfer`

  return new LogTxModel({
    key: tx.block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
    type: 'tx',
    name: 'transfer',
    date: new Date(tx.time ? (tx.time * 1000) : null),
    icon: 'event',
    title: `${path}.title`,
    message: tx.to,
    target: null,
    fields: [
      {
        value: tx.from,
        description: `${path}.from`,
      },
      {
        value: tx.to,
        description: `${path}.to`,
      },
      {
        value: amount,
        description: `${path}.amount`,
      },
      {
        value: fee,
        description: `${path}.fee`,
      },
    ],
  })
}
