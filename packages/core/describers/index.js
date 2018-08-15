import BigNumber from 'bignumber.js'
import Web3ABI from 'web3-eth-abi'
import { Amount } from '../models'
import LogEventModel from '../models/LogEventModel'
import LogTxModel from '../models/LogTxModel'
import { EVENT_DESCRIBERS_BY_TOPIC, decodeLog } from './events'
import { TRANSACTION_DESCRIBERS_BY_TOPIC, decodeParameters, findFunctionABI } from './transactions'
import { decodeTxData } from '../utils/DecodeUtils'
import { ETH } from '../dao/constants'

export const describeEvent = (data, context) => {
  const { log, block } = data

  console.log('describeEvent: ', data, data.log.topics[0], EVENT_DESCRIBERS_BY_TOPIC)

  const array = EVENT_DESCRIBERS_BY_TOPIC[data.log.topics[0]]
  console.log('describeEvent: array: ', array, EVENT_DESCRIBERS_BY_TOPIC)
  if (array) {
    for (const describer of array) {
      const { input, params } = decodeLog(describer.abi, data.log)
      const desc = describer.describe(data, context, { abi: describer.abi, input, params })
      console.log('describer.describe: ', desc)
      if (desc) {
        return desc
      }
    }
  }

  return new LogEventModel({
    key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
    type: 'event',
    name: 'custom',
    date: new Date(block.timestamp * 1000),
    icon: 'event',
    title: 'Custom event',
    message: `${log.address}`,
    target: null,
    amount: null,
  })
}

const formatPengigTxData = ({ abi, tx }) => {
  const data = abi != null && tx.data != null // nil check
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
  const { dao } = context
  const address = context.address.toLowerCase()

  const v = new BigNumber(tx.value)
  const fee = new BigNumber(tx.gasPrice).mul(receipt ? receipt.cumulativeGasUsed : tx.gasLimit)

  let value = null
  let amountTitle = null
  if (tx.from.toLowerCase() === address && tx.to.toLowerCase() === address) {
    value = fee.mul(-1)
    amountTitle = 'tx.fee'
  } else if (tx.from.toLowerCase() === address) {
    value = v.minus(fee)
    amountTitle = v.eq(0) ? 'tx.fee' : 'tx.amountFee'
  } else {
    value = v
    amountTitle = 'tx.amount'
  }

  const amount = new Amount(value, dao.token ? dao.token.symbol() : ETH)
  const path = `tx`
  return new LogTxModel({
    key: block ? `${block.hash}/${tx.transactionIndex}` : null,
    type: 'tx',
    name: 'custom',
    date: new Date(block ? (block.timestamp * 1000) : null),
    icon: 'event',
    title: `${path}.title`,
    message: tx.to,
    target: null,
    amountTitle,
    isAmountSigned: true,
    amount,
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

export const describeTx = (entry, context) => {
  const { tx, receipt } = entry
  const { dao } = context
  const abi = dao.abi

  let info
  if (!receipt) {
    info = formatPengigTxData({ abi, tx })
  } else {
    info = {
      topic: tx.input.substr(0, 10),
      ...decodeParameters(abi, entry.tx),
    }
  }

  const array = TRANSACTION_DESCRIBERS_BY_TOPIC[info.topic]
  if (array) {
    for (const describer of array) {
      const desc = describer.describe(entry, context, { abi: describer.abi, inputs: info.inputs, params: info.params })
      if (desc) {
        return desc
      }
    }
  }

  return defaultDescription(entry, context)
}

export const describeUnknownTx = (entry, context) => {
  const { tx, receipt } = entry
  const { dao } = context
  const abi = dao.abi

  let info
  if (!receipt) {
    info = formatPengigTxData({ abi, tx })
  } else {
    info = {
      topic: tx.input.substr(0, 10),
      ...decodeParameters(abi, entry.tx),
    }
  }

  const array = TRANSACTION_DESCRIBERS_BY_TOPIC[info.topic]
  if (array) {
    for (const describer of array) {
      const desc = describer.describe(entry, context, { abi: describer.abi, inputs: info.inputs, params: info.params })
      if (desc) {
        return desc
      }
    }
  }

  return defaultDescription(entry, context)
}
