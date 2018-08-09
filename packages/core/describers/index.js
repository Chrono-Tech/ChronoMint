import BigNumber from 'bignumber.js'
import { LogTxModel, LogEventModel, Amount } from '../models'

import { EVENT_DESCRIBERS_BY_TOPIC, decodeLog } from './events'
import { TRANSACTION_DESCRIBERS_BY_TOPIC, decodeParameters } from './transactions'

export const describeEvent = (data, context) => {
  const { log, block } = data

  const array = EVENT_DESCRIBERS_BY_TOPIC[data.log.topics[0]]
  if (array) {
    for (const describer of array) {
      const { input, params } = decodeLog(describer.abi, data.log)
      const desc = describer.describe(data, context, { abi: describer.abi, input, params })
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

export const describeTx = (data, context) => {
  const { tx, receipt, block } = data

  const array = TRANSACTION_DESCRIBERS_BY_TOPIC[tx.input.substr(0, 10)]
  if (array) {
    for (const describer of array) {
      const { inputs, params } = decodeParameters(describer.abi, data.tx)
      const desc = describer.describe(data, context, { abi: describer.abi, inputs, params })
      if (desc) {
        return desc
      }
    }
  }

  const token = context.getters['tokens/getETHToken']

  const address = context.address.toLowerCase()

  const v = new BigNumber(tx.value)
  const fee = new BigNumber(tx.gasPrice).multipliedBy(receipt.cumulativeGasUsed)

  let value = null
  let amountTitle = null
  if (tx.from.toLowerCase() === address && tx.to.toLowerCase() === address) {
    value = fee.multipliedBy(-1)
    amountTitle = 'Fee'
  } else if (tx.from.toLowerCase() === address) {
    value = v.minus(fee)
    amountTitle = v.isEqualTo(0) ? 'Fee' : 'Amount+Fee'
  } else {
    value = v
    amountTitle = 'Amount'
  }

  return new LogTxModel({
    key: `${block.hash}/${tx.transactionIndex}`,
    type: 'tx',
    name: 'custom',
    date: new Date(block.timestamp * 1000),
    icon: 'event',
    title: 'Transaction',
    message: tx.to,
    target: null,
    amountTitle,
    isAmountSigned: true,
    amount: new Amount({
      token,
      value,
    }),
  })
}
