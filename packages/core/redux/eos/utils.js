/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import Eos from 'eosjs'
import { TxEntryModel } from '../../models'
import { EOS_NETWORK_CONFIG } from './constants'
import TxDescModel from '../../models/TxDescModel'
import Amount from '../../models/Amount'

export const createEosTxEntryModel = (entry) => {
  return new TxEntryModel({
    key: uuid(),
    isSubmitted: true,
    isAccepted: false,
    ...entry,
  })
}

export const prepareTransactionToOfflineSign = async (tx, { httpEndpoint, chainId }) => {
  const eos = Eos({ httpEndpoint, chainId }) // create eos read-only instance

  const expireInSeconds = 60 * 60 // 1 hour
  const info = await eos.getInfo({})
  const chainDate = new Date(info.head_block_time + 'Z')
  let expiration = new Date(chainDate.getTime() + expireInSeconds * 1000)
  expiration = expiration.toISOString().split('.')[0]
  const block = await eos.getBlock(info.last_irreversible_block_num)

  const transactionHeaders = {
    expiration,
    ref_block_num: info.last_irreversible_block_num & 0xFFFF,
    ref_block_prefix: block.ref_block_prefix,
  }
  return { chainId, transactionHeaders, tx }
}

export const getEOSNetworkConfig = (type) => {
  return EOS_NETWORK_CONFIG[type]
}

export const createDescModel = (action) => {
  const act = action.action_trace.act
  const { from, to, memo, quantity } = act.data
  const [value, symbol] = quantity.split(' ')

  return new TxDescModel({
    hash: action.action_trace.trx_id,
    type: action.action_trace.act.name,
    title: action.action_trace.act.name,
    address: action.action_trace.trx_id,
    from: from,
    to: to,
    value: new Amount(value, symbol),
    params: [
      { name: 'from', value: from },
      { name: 'to', value: to },
      { name: 'quantity', value: quantity },
      { name: 'memo', value: memo },
    ],
  })
}
