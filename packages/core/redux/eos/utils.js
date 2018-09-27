/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import Eos from 'eosjs'
import { TxEntryModel } from '../../models'
import { EOS_NETWORK_CONFIG } from './constants'

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
