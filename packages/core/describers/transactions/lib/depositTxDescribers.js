/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import { findFunctionABI, TransactionDescriber } from '../TransactionDescriber'
import { Amount, LogTxModel } from '../../../models'
import { AssetHolderABI } from '../../../dao/abi'
import { TIME } from '../../../dao/constants'
import { TX_DEPOSIT, TX_LOCK, TX_UNLOCK_SHARES, TX_WITHDRAW_SHARES } from '../../../dao/constants/AssetHolderDAO'

export const FUNCTION_DEPOSIT = new TransactionDescriber(
  findFunctionABI(AssetHolderABI, TX_DEPOSIT),
  ({ tx, block }, { address }, { params, feeSymbol }) => {
    address = address.toLowerCase()

    if ((tx.to.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const transferAmount = new Amount(params._amount, TIME)
      const path = `tx.${AssetHolderABI.contractName}.${TX_DEPOSIT}`

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

export const FUNCTION_WITHDRAW = new TransactionDescriber(
  findFunctionABI(AssetHolderABI, TX_WITHDRAW_SHARES),
  ({ tx, block }, { address }, { params, feeSymbol }) => {
    address = address.toLowerCase()

    if ((tx.to.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const transferAmount = new Amount(params._amount, TIME)
      const path = `tx.${AssetHolderABI.contractName}.${TX_WITHDRAW_SHARES}`

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

export const FUNCTION_LOCK = new TransactionDescriber(
  findFunctionABI(AssetHolderABI, TX_LOCK),
  ({ tx, block }, { address }, { params, feeSymbol }) => {
    address = address.toLowerCase()

    if ((tx.to.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const transferAmount = new Amount(params._amount, TIME)
      const path = `tx.${AssetHolderABI.contractName}.${TX_LOCK}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: 'transfer',
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        symbol: feeSymbol,
        eventTitle: `${path}.eventTitle`,
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

export const FUNCTION_UNLOCK_SHARES = new TransactionDescriber(
  findFunctionABI(AssetHolderABI, TX_UNLOCK_SHARES),
  ({ tx, block }, { address }, { feeSymbol }) => {
    address = address.toLowerCase()

    if ((tx.to.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const path = `tx.${AssetHolderABI.contractName}.${TX_UNLOCK_SHARES}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: 'transfer',
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        symbol: feeSymbol,
        eventTitle: `${path}.eventTitle`,
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
