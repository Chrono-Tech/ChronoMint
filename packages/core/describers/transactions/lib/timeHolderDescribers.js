/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import { findFunctionABI, TransactionDescriber } from '../TransactionDescriber'
import { LogTxModel } from '../../../models'
import { TimeHolderABI } from '../../../redux/laborHour/dao/abi'
import { TIME } from '../../../dao/constants'
import {
  TX_DEPOSIT,
  TX_START_MINING_IN_CUSTOM_NODE,
  TX_UNLOCK_DEPOSIT_AND_RESIGN_MINER,
} from '../../../redux/laborHour/dao/TimeHolderDAO'
import Amount from '../../../models/Amount'

export const FUNCTION_DEPOSIT = new TransactionDescriber(
  findFunctionABI(TimeHolderABI, TX_DEPOSIT),
  ({ tx, block }, { address }, { params, feeSymbol }) => {
    address = address.toLowerCase()

    if ((tx.to.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const transferAmount = new Amount(params._amount, TIME)
      const path = `tx.${TimeHolderABI.contractName}.${TX_DEPOSIT}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: 'transfer',
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        eventTitle: `${path}.eventTitle`,
        symbol: feeSymbol,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: transferAmount,
            description: `${path}.amount`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_START_MINING_IN_CUSTOM_NODE = new TransactionDescriber(
  findFunctionABI(TimeHolderABI, TX_START_MINING_IN_CUSTOM_NODE),
  ({ tx, block }, { address }, { params, feeSymbol }) => {
    address = address.toLowerCase()

    if ((tx.to.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const transferAmount = new Amount(params._amount, TIME)
      const path = `tx.${TimeHolderABI.contractName}.${TX_START_MINING_IN_CUSTOM_NODE}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: 'transfer',
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        eventTitle: `${path}.eventTitle`,
        symbol: feeSymbol,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: transferAmount,
            description: `${path}.amount`,
          },
          {
            value: params._delegate,
            description: '${path}.delegateAddress',
          },
        ],
      })
    }
  },
)

export const FUNCTION_UNLOCK_DEPOSIT_AND_RESIGN_MINER = new TransactionDescriber(
  findFunctionABI(TimeHolderABI, TX_UNLOCK_DEPOSIT_AND_RESIGN_MINER),
  ({ tx, block }, { address }, { feeSymbol }) => {
    address = address.toLowerCase()

    if ((tx.to.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const path = `tx.${TimeHolderABI.contractName}.${TX_UNLOCK_DEPOSIT_AND_RESIGN_MINER}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: 'transfer',
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        eventTitle: `${path}.eventTitle`,
        symbol: feeSymbol,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
        ],
      })
    }
  },
)
