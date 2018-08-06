/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import OperationNoticeModel from '../models/notices/OperationNoticeModel'
import OperationModel from '../models/OperationModel'
import type TxExecModel from '../models/TxExecModel'
import { MultiEventsHistoryABI, PendingManagerABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'
import contractsManagerDAO from './ContractsManagerDAO'

//#region CONSTANTS

import {
  OPERATIONS_PER_PAGE,
  PENDING_ID_PREFIX,
  TX_CONFIRM,
  TX_REVOKE,
} from './constants/PendingManagerDAO'

//#endregion CONSTANTS

const EVENT_DONE = 'Done'
const EVENT_CONFIRMATION = 'Confirmation'
const EVENT_REVOKE = 'Revoke'
const EVENT_CANCELLED = 'Cancelled'

export default class PendingManagerDAO extends AbstractContractDAO {
  constructor (at) {
    super(PendingManagerABI, at, MultiEventsHistoryABI)

    this._okCodes = [ resultCodes.OK, resultCodes.MULTISIG_ADDED ]
  }

  multisigDAO () {
    return [
      contractsManagerDAO.getUserManagerDAO(),
      contractsManagerDAO.getLOCManagerDAO(),
      contractsManagerDAO.getPollInterfaceDAO(),
      contractsManagerDAO.getPlatformManagerDAO(),
    ]
  }

  async getList () {
    const [ hashes, yetNeededArr, ownersDoneArr, timestampArr ] = await this._call('getTxs')

    let promises = []
    for (const hash of hashes) {
      promises.push(this._call('getTxData', [ hash ]))
    }
    const dataArr = await Promise.all(promises)

    promises = []
    for (const data of dataArr) {
      promises.push(this._parseData(data))
    }
    const txs = await Promise.all(promises)

    let map = new Immutable.Map()
    for (const i in hashes) {
      if (hashes.hasOwnProperty(i)) {
        const tx = txs[ i ]
        // TODO @ipavlenko: For the reason unknown we may get null here
        if (tx !== null) {
          const model = new OperationModel({
            id: `P-${hashes[ i ]}`,
            tx: txs[ i ].set('timestamp', timestampArr[ i ].toNumber() * 1000),
            remained: yetNeededArr[ i ].toNumber(),
            // number of 1 bits in binary representation
            completed: ownersDoneArr[ i ].toNumber().toString(2).split('1').length - 1,
            isConfirmed: this._isConfirmed(ownersDoneArr[ i ]),
          })
          map = map.set(model.originId(), model)
        }
      }
    }

    return map
  }

  async getCompletedList () {
    let map = new Immutable.Map()
    const r = await this._get('Done', 0, 'latest', {}, OPERATIONS_PER_PAGE)

    const promises = []
    for (const event of r) {
      promises.push(this._parseData(event.args.data))
    }
    const txs = await Promise.all(promises)

    for (const i in r) {
      if (r.hasOwnProperty(i)) {
        const tx = txs[ i ]
        // TODO @ipavlenko: For the reason unknown we may get null here
        if (tx !== null) {
          const operation = new OperationModel({
            id: r[ i ].args.hash,
            tx: txs[ i ].set('timestamp', r[ i ].args.timestamp * 1000),
            isDone: true,
          })
          map = map.set(operation.id(), operation)
        }
      }
    }

    return map
  }

  confirm (operation: OperationModel) {
    return this._tx(TX_CONFIRM, [ operation.id() ], operation)
  }

  revoke (operation: OperationModel) {
    return this._tx(TX_REVOKE, [ operation.id() ], operation)
  }

  /**
   * @private
   * @param callback will receive...
   * @see OperationNoticeModel
   * @param isRevoked
   */
  _watchPendingCallback = (callback, isRevoked: boolean = false) => async (result, block, time) => {
    // noinspection JSUnusedLocalSymbols
    const hash = result.args.hash
    const [ data, remained, done, timestamp ] = await this._call('getTx', [ hash ])
    const tx = await this._parseData(data)
    const operation = new OperationModel({
      id: PENDING_ID_PREFIX + hash,
      tx: tx ? tx.set('timestamp', timestamp.toNumber() * 1000) : null,
      remained: remained.toNumber(),
      // number of 1 bits in binary representation
      completed: done.toNumber().toString(2).split('1').length - 1,
      isConfirmed: this._isConfirmed(done),
    })
    if (operation.isCompleted() && !isRevoked) {
      return
    }
    callback(new OperationNoticeModel({
      operation,
      isRevoked,
      time,
    }))
  }

  async watchConfirmation (callback) {
    return this._watch(EVENT_CONFIRMATION, this._watchPendingCallback(callback))
  }

  async watchRevoke (callback) {
    return this._watch(EVENT_REVOKE, this._watchPendingCallback(callback, true))
  }

  async watchDone (callback) {
    return this._watch(EVENT_DONE, async (r, block, time) => {
      const tx = await this._parseData(r.args.data)

      callback(new OperationModel({
        id: PENDING_ID_PREFIX + r.args.hash,
        tx: tx.set('timestamp', time),
        isDone: true,
      }))
    })
  }

  watchTxEnd (hash): Promise<boolean> {
    return new Promise((resolve) => {
      this._watch(EVENT_DONE, () => resolve(true), { hash })
      this._watch(EVENT_CANCELLED, () => resolve(false), { hash })
    })
  }

  setMemberId (id) {
    this._memberId = id
  }

  /**
   * Returns 'is confirmed by authorized user' flag or null for cancelled operation.
   * @param bmp
   * @returns {boolean|null} null for cancelled
   * @private
   */
  _isConfirmed (bmp) {
    if (!this._memberId) {
      throw new Error('_memberId is not defined')
    }
    bmp = bmp.toNumber()
    if (!bmp) {
      return null
    }
    return (bmp & (2 ** this._memberId)) !== 0
  }

  /** @private */
  async _parseData (data): Promise<TxExecModel> {
    for (let dao of this.multisigDAO()) {
      dao = await dao
      const tx = await dao.decodeData(data)
      if (tx !== null) {
        return tx
      }
    }
    // eslint-disable-next-line
    console.warn('decode failed for data:', data)
    return null
  }
}
