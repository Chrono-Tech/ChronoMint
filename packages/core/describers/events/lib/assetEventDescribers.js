/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { EventDescriber, findEventABI } from '../EventDescriber'
import LogEventModel from '../../../models/LogEventModel'
import {
  ChronoBankPlatformEmitterABI,
  PlatformTokenExtensionGatewayManagerEmitterABI,
} from '../../../dao/abi'

import {
  TX_ISSUE,
  TX_REVOKE,
  TX_APPROVE,
  TX_OWNERSHIP_CHANGE,
  TX_RECOVERY,
  TX_ASSET_TRANSFER,
} from '../../../dao/constants/ChronoBankPlatformDAO'
import {
  TX_ASSET_CREATED,
} from '../../../dao/constants/PlatformTokenExtensionGatewayManagerEmitterDAO'

export const EVENT_ISSUE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, TX_ISSUE),
  ({ log, block }, context, { params }) => {

    console.log('Event log EVENT_ISSUE: ', log, params)

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: TX_ISSUE,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: TX_ISSUE,
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_REVOKE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, TX_REVOKE),
  ({ log, block }, context, { params }) => {
    console.log('Event log EVENT_REVOKE: ', log, params)

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: TX_REVOKE,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: TX_REVOKE,
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_OWNERSHIP_CHANGE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, TX_OWNERSHIP_CHANGE),
  ({ log, block }, context, { params }) => {
    console.log('Event log EVENT_OWNERSHIP_CHANGE: ', log, params)

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: TX_OWNERSHIP_CHANGE,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: TX_OWNERSHIP_CHANGE,
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_APPROVE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, TX_APPROVE),
  ({ log, block }, context, { params }) => {
    console.log('Event log EVENT_APPROVE: ', log, params)

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: TX_APPROVE,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: TX_APPROVE,
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_RECOVERY = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, TX_RECOVERY),
  ({ log, block }, context, { params }) => {
    console.log('Event log EVENT_RECOVERY: ', log, params)

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Recovery',
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Recovery',
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_TRANSFER = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, TX_ASSET_TRANSFER),
  ({ log, block }, context, { params }) => {
    console.log('Event log EVENT_TRANSFER: ', log, params)

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: TX_ASSET_TRANSFER,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: TX_ASSET_TRANSFER,
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_ERROR = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'Error'),
  ({ log, block }, context, { params }) => {

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Error',
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Error',
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_ASSET_CREATED = new EventDescriber(
  findEventABI(PlatformTokenExtensionGatewayManagerEmitterABI, TX_ASSET_CREATED),
  ({ log, block }, context, { params }) => {
    console.log('Event log EVENT_ASSET_CREATED: ', log)

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: TX_ASSET_CREATED,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: TX_ASSET_CREATED,
      message: params.proxy,
      target: null,
    })
  },
)
