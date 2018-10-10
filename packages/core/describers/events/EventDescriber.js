/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3ABI from 'web3-eth-abi'

export class EventDescriber {
  constructor (abi, describe) {
    this.abi = abi
    this.describe = describe
    this.topic = Web3ABI.encodeEventSignature(abi)
    Object.freeze(this)
  }
}

export const decodeLog = (abi, log) => {
  const [, ...topics] = log.topics
  if (!log.data || log.data === '0x' || log.data === '0X') {
    log.data = getDataFromLog(log)
  }
  const params = Web3ABI.decodeLog(abi.inputs, log.data, topics)

  const inputs = abi.inputs.map(
    (input) => ({
      input,
      value: params[input.name],
    }),
  )
  return {
    params,
    inputs,
  }
}

const getDataFromLog = (log) => {
  const dataIndexStart = log.dataIndexStart
  let data = ''
  for (let i = dataIndexStart; i < log.topics.length; i++) {
    data += log.topics[i].replace(/^0[xX]/, '')
  }
  return data
}

export const findEventABI = (abi, name) => {
  return abi.abi.find((entry) => entry.type === 'event' && entry.name === name)
}
