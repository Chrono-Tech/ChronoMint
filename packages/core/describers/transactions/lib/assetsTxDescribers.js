/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import { findFunctionABI, TransactionDescriber } from '../TransactionDescriber'
import { LogTxModel } from '../../../models'

import {
  TokenManagementInterfaceABI,
  PlatformsManagerABI,
  ChronoBankPlatformABI,
} from '../../../dao/abi'
import {
  TX_CREATE_ASSET_WITHOUT_FEE,
  TX_CREATE_ASSET_WITH_FEE,
} from '../../../dao/constants/AssetsManagerDAO'
import {
  TX_CREATE_PLATFORM,
  TX_ATTACH_PLATFORM,
  TX_DETACH_PLATFORM,
} from '../../../dao/constants/PlatformsManagerDAO'

import {
  TX_REISSUE_ASSET,
  TX_REMOVE_ASSET_PART_OWNER,
  TX_REVOKE_ASSET,
} from '../../../dao/constants/ChronoBankPlatformDAO'

export const FUNCTION_CREATE_ASSET_WITH_FEE = new TransactionDescriber(
  findFunctionABI(TokenManagementInterfaceABI, TX_CREATE_ASSET_WITH_FEE),
  ({ tx, block }, { address }) => {
    address = address.toLowerCase()

    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {
      const path = `tx.${TokenManagementInterfaceABI.contractName}.${TX_CREATE_ASSET_WITH_FEE}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_CREATE_ASSET_WITH_FEE,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        eventTitle: `${path}.eventTitle`,
        path,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.to`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_CREATE_ASSET_WITHOUT_FEE = new TransactionDescriber(
  findFunctionABI(TokenManagementInterfaceABI, TX_CREATE_ASSET_WITHOUT_FEE),
  ({ tx, block }, { address }) => {
    address = address.toLowerCase()

    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {
      const path = `tx.${TokenManagementInterfaceABI.contractName}.${TX_CREATE_ASSET_WITHOUT_FEE}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_CREATE_ASSET_WITHOUT_FEE,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        eventTitle: `${path}.eventTitle`,
        path,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.to`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_CREATE_PLATFORM = new TransactionDescriber(
  findFunctionABI(PlatformsManagerABI, TX_CREATE_PLATFORM),
  ({ tx, block }, { address }) => {
    address = address.toLowerCase()

    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {
      const path = `tx.${PlatformsManagerABI.contractName}.${TX_CREATE_PLATFORM}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_CREATE_PLATFORM,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        eventTitle: `${path}.eventTitle`,
        path,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.to`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_ATTACH_PLATFORM = new TransactionDescriber(
  findFunctionABI(PlatformsManagerABI, TX_ATTACH_PLATFORM),
  ({ tx, block }, { address }) => {
    address = address.toLowerCase()

    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {
      const path = `tx.${PlatformsManagerABI.contractName}.${FUNCTION_ATTACH_PLATFORM}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: FUNCTION_ATTACH_PLATFORM,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        eventTitle: `${path}.eventTitle`,
        path,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.to`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_DETACH_PLATFORM = new TransactionDescriber(
  findFunctionABI(PlatformsManagerABI, TX_DETACH_PLATFORM),
  ({ tx, block }, { address }) => {
    address = address.toLowerCase()

    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {
      const path = `tx.${TokenManagementInterfaceABI.contractName}.${TX_DETACH_PLATFORM}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_DETACH_PLATFORM,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        path,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.to`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_REISSUE_ASSET = new TransactionDescriber(
  findFunctionABI(ChronoBankPlatformABI, TX_REISSUE_ASSET),
  ({ tx, block }, { address }) => {
    address = address.toLowerCase()

    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {
      const path = `tx.${TokenManagementInterfaceABI.contractName}.${TX_REISSUE_ASSET}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_REISSUE_ASSET,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        path,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.to`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_REMOVE_ASSET_PART_OWNER = new TransactionDescriber(
  findFunctionABI(ChronoBankPlatformABI, TX_REMOVE_ASSET_PART_OWNER),
  ({ tx, block }, { address }) => {
    address = address.toLowerCase()

    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {
      const path = `tx.${TokenManagementInterfaceABI.contractName}.${TX_REMOVE_ASSET_PART_OWNER}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_REMOVE_ASSET_PART_OWNER,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        path,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.to`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_REVOKE_ASSET = new TransactionDescriber(
  findFunctionABI(ChronoBankPlatformABI, TX_REVOKE_ASSET),
  ({ tx, block }, { address }) => {
    address = address.toLowerCase()

    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {
      const path = `tx.${TokenManagementInterfaceABI.contractName}.${TX_REVOKE_ASSET}`

      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_REVOKE_ASSET,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.title`,
        path,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.to`,
          },
        ],
      })
    }
  },
)
