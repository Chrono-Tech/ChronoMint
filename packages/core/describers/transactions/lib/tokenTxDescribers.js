/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import { findFunctionABI, TransactionDescriber } from '../TransactionDescriber'
import { Amount, LogTxModel } from '../../../models'
import { AssetDonatorABI, ERC20DAODefaultABI } from '../../../dao/abi'
import { TIME } from '../../../dao/constants'

export const FUNCTION_TRANSFER = new TransactionDescriber(
  findFunctionABI(ERC20DAODefaultABI, 'transfer'),
  ({ tx, block }, { address }, { params, token }) => {
    const symbol = token.symbol()
    address = address.toLowerCase()

    if (symbol && (params._to.toLowerCase() === address || tx.from.toLowerCase() === address)) {

      const transferAmount = new Amount(params._value, symbol)

      const path = `tx.${ERC20DAODefaultABI.contractName}.transfer`
      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: 'transfer',
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: params._to,
            description: `${path}.to`,
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

export const FUNCTION_APPROVE = new TransactionDescriber(
  findFunctionABI(ERC20DAODefaultABI, 'approve'),
  ({ tx, block }, { address }, { params, token }) => {
    const symbol = token.symbol()
    address = address.toLowerCase()
    if (symbol && (params._spender.toLowerCase() === address || tx.from.toLowerCase() === address)) {
      const value = new Amount(params._value, symbol)

      const path = `tx.${ERC20DAODefaultABI.contractName}.approve`
      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: 'approve',
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        from: '',
        to: '',
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: params._spender,
            description: `${path}.spender`,
          },
          {
            value,
            description: `${path}.amount`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_REQUIRE_TIME = new TransactionDescriber(
  findFunctionABI(AssetDonatorABI, 'sendTime'),
  ({ tx, block }) => {
    const symbol = TIME
    const transferAmount = new Amount(1000000000, symbol)
    const path = `tx.${ERC20DAODefaultABI.contractName}.sendTime`
    return new LogTxModel({
      key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
      name: 'sendTime',
      date: new Date(block ? (block.timestamp * 1000) : null),
      title: `${path}.title`,
      fields: [
        {
          value: tx.from,
          description: `${path}.donation`,
        },
        {
          value: transferAmount,
          description: `${path}.amount`,
        },
      ],
    })
  },
)
