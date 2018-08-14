import BigNumber from 'bignumber.js'
import { EventDescriber, findEventABI } from '../EventDescriber'
import LogEventModel from '../../../models/LogEventModel'
import Amount from '../../../models/Amount'
import { ChronoBankPlatformEmitterABI } from '../../../dao/abi'

export const EVENT_ISSUE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'Issue'),
  ({ log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi }) => {
    console.log('EventDescriber EVENT_ISSUE: ', { log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi })

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Issue',
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Asset created',
      message: params.proxy,
      target: null,
    })
  }
)

export const EVENT_REVOKE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'Revoke'),
  ({ log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi }) => {
    console.log('EventDescriber REVOKE: ', { log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi })

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Revoke',
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Revoke',
      message: params.proxy,
      target: null,
    })
  }
)

export const EVENT_OWNERSHIP_CHANGE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'OwnershipChange'),
  ({ log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi }) => {
    console.log('EventDescriber OwnershipChange: ', { log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi })

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Revoke',
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Revoke',
      message: params.proxy,
      target: null,
    })
  }
)

export const EVENT_APPROVE = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'Approve'),
  ({ log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi }) => {
    console.log('EventDescriber Approve: ', { log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi })

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Approve',
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Approve',
      message: params.proxy,
      target: null,
    })
  }
)

export const EVENT_RECOVERY = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'Recovery'),
  ({ log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi }) => {
    console.log('EventDescriber Recovery: ', { log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi })

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Recovery',
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Approve',
      message: params.proxy,
      target: null,
    })
  }
)

export const EVENT_OWNERSHIP_RECOVERY = new EventDescriber(
  findEventABI(ChronoBankPlatformEmitterABI, 'Recovery'),
  ({ log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi }) => {
    console.log('EventDescriber Recovery: ', { log, tx, receipt, block }, { address, agents, getters }, { inputs, params, abi })

    return new LogEventModel({
      key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
      type: 'event',
      name: 'Recovery',
      date: new Date(block.timestamp * 1000),
      icon: 'event',
      title: 'Approve',
      message: params.proxy,
      target: null,
    })
  }
)
