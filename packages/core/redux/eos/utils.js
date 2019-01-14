/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import Eos from 'eosjs'
import { EOS_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import { TxEntryModel } from '../../models'
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

  const expireInSeconds = 60 * 60 * 1000
  const info = await eos.getInfo({})
  const chainDate = new Date(info.head_block_time + 'Z')
  let expiration = new Date(chainDate.getTime() + expireInSeconds)
  expiration = expiration.toISOString().split('.')[0]
  const block = await eos.getBlock(info.last_irreversible_block_num)

  const transactionHeaders = {
    expiration,
    ref_block_num: info.last_irreversible_block_num & 0xFFFF, // got from docs https://github.com/EOSIO/eosjs-api/blob/master/docs/index.md#headers--object
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

  return new TxDescModel({
    hash: action.action_trace.trx_id,
    type: action.action_trace.act.name,
    title: action.action_trace.act.name,
    address: action.action_trace.trx_id,
    time: new Date(action.block_time).getTime() / 1000,
    from,
    to,
    value: quantity ? new Amount(...quantity.split(' ')) : null,
    params: [
      { name: 'from', value: from },
      { name: 'to', value: to },
      { name: 'quantity', value: quantity },
      { name: 'memo', value: memo },
    ],
  })
}
