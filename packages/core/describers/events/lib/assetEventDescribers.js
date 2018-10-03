/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { EventDescriber, findEventABI } from '../EventDescriber'
import LogEventModel from '../../../models/describers/LogEventModel'
import {
  ChronoBankPlatformEmitterABI,
  PlatformTokenExtensionGatewayManagerEmitterABI,
  PlatformsManagerABI,
} from '../../../dao/abi'
import web3Converter from '../../../utils/Web3Converter'

import {
  EVENT_PLATFORM_REQUESTED,
  EVENT_PLATFORM_ATTACHED,
  EVENT_PLATFORM_DETACHED,
} from '../../../dao/constants/PlatformsManagerDAO'

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

export const getKey = ({ log, block, tx }) => {
  return `${log.blockHash || block.hash}/${log.transactionIndex || tx.index}/${log.logIndex || log.index}`
}

export const EVENT_DESC_PLATFORM_REQUESTED = new EventDescriber(
  findEventABI(PlatformsManagerABI, EVENT_PLATFORM_REQUESTED),
  ({ log, block, tx }, context, { params }) => {

    const { platform } = params

    return new LogEventModel({
      key: getKey({ log, block, tx }),
      name: EVENT_PLATFORM_REQUESTED,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: `Platform ${platform} created`,
      subTitle: platform,
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_DESC_PLATFORM_ATTACHED = new EventDescriber(
  findEventABI(PlatformsManagerABI, EVENT_PLATFORM_ATTACHED),
  ({ log, block, tx }, context, { params }) => {

    const { platform } = params

    return new LogEventModel({
      key: getKey({ log, block, tx }),
      name: EVENT_PLATFORM_REQUESTED,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: `Platform ${platform} attached`,
      subTitle: platform,
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_DESC_PLATFORM_DETACHED = new EventDescriber(
  findEventABI(PlatformsManagerABI, EVENT_PLATFORM_DETACHED),
  ({ log, block, tx }, context, { params }) => {

    const { platform } = params

    return new LogEventModel({
      key: getKey({ log, block, tx }),
      name: EVENT_PLATFORM_DETACHED,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: `Platform ${platform} detached`,
      subTitle: platform,
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_ISSUE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, TX_ISSUE),
  ({ log, block, tx }, context, { params }) => {

    const symbol = web3Converter.bytesToString(params.symbol).toUpperCase()
    const token = context.store.tokens.getBySymbol(symbol)

    let value, mark = ''
    if (token) {
      value = token.removeDecimals(new BigNumber(params.value))
      mark = value > 0 ? '+' : '-'
    }

    return new LogEventModel({
      key: getKey({ log, block, tx }),
      name: TX_ISSUE,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: `Issue ${mark}${value}`,
      subTitle: symbol,
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_REVOKE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, TX_REVOKE),
  ({ log, block, tx }, context, { params }) => {

    const symbol = web3Converter.bytesToString(params.symbol).toUpperCase()

    return new LogEventModel({
      key: getKey({ log, block, tx }),
      name: TX_REVOKE,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: TX_REVOKE,
      subTitle: symbol,
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_OWNERSHIP_CHANGE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, TX_OWNERSHIP_CHANGE),
  ({ log, block, tx }, context, { params }) => {

    const symbol = web3Converter.bytesToString(params.symbol).toUpperCase()

    return new LogEventModel({
      key: getKey({ log, block, tx }),
      name: TX_OWNERSHIP_CHANGE,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: TX_OWNERSHIP_CHANGE,
      subTitle: symbol,
      message: params.proxy,
      target: null,
    })
  },
)

export const EVENT_APPROVE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, TX_APPROVE),
  ({ log, block, tx }, context, { params }) => {

    return new LogEventModel({
      key: getKey({ log, block, tx }),
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
  ({ log, block, tx }, context, { params }) => {

    return new LogEventModel({
      key: getKey({ log, block, tx }),
      name: TX_RECOVERY,
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
  ({ log, block, tx }, context, { params }) => {

    return new LogEventModel({
      key: getKey({ log, block, tx }),
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
  ({ log, block, tx }, context, { params }) => {

    return new LogEventModel({
      key: getKey({ log, block, tx }),
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
  ({ log, block, tx }, context, { params }) => {

    const symbol = web3Converter.bytesToString(params.symbol).toUpperCase()

    return new LogEventModel({
      key: getKey({ log, block, tx }),
      name: TX_ASSET_CREATED,
      address: log.address,
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: TX_ASSET_CREATED,
      subTitle: symbol,
      message: params.proxy,
      target: null,
    })
  },
)
