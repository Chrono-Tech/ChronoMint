/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { EventDescriber, findEventABI } from '../EventDescriber'
import LogEventModel from '../../../models/LogEventModel'
import { ChronoBankPlatformEmitterABI,  PlatformTokenExtensionGatewayManagerEmitterABI } from '../../../dao/abi'

export const EVENT_ISSUE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'Issue'),
  ({ log, block }, context, { params }) => {

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Issue',
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Asset created',
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_REVOKE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'Revoke'),
  ({ log, block }, context, { params }) => {

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Revoke',
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Revoke',
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_OWNERSHIP_CHANGE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'OwnershipChange'),
  ({ log, block }, context, { params }) => {

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'OwnershipChange',
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'OwnershipChange',
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_APPROVE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'Approve'),
  ({ log, block }, context, { params }) => {

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Approve',
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Approve',
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_RECOVERY = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'Recovery'),
  ({ log, block }, context, { params }) => {

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
  findEventABI(ChronoBankPlatformEmitterABI, 'Transfer'),
  ({ log, block }, context, { params }) => {

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Transfer',
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Transfer',
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
  findEventABI(PlatformTokenExtensionGatewayManagerEmitterABI, 'AssetCreated'),
  ({ log, block }, context, { params }) => {

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'AssetCreated',
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Asset created',
      message: params.proxy,
      target: null,
    })
  },
)
