import Immutable from 'immutable'

import AbstractContractDAO from './AbstractContractDAO'

import OperationModel from '../models/OperationModel'
import OperationNoticeModel from '../models/notices/OperationNoticeModel'

import contractsManagerDAO from './ContractsManagerDAO'


// to distinguish equal operations between completed and pending lists
export const PENDING_ID_PREFIX = 'P-'

export const TX_CONFIRM = 'confirm'
export const TX_REVOKE = 'revoke'

const EVENT_DONE = 'Done'
const EVENT_CONFIRMATION = 'Confirmation'
const EVENT_REVOKE = 'Revoke'
const EVENT_CANCELLED = 'Cancelled'


export default class PendingManagerDAO extends AbstractContractDAO {
  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/PendingManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  multisigDAO () {
    return [
      contractsManagerDAO.getUserManagerDAO(),
      contractsManagerDAO.getLOCManagerDAO(),
      contractsManagerDAO.getVoteDAO()
    ]
  }

  async getList () {
    const [hashes, yetNeededArr, ownersDoneArr, timestampArr] = await this._call('getTxs')

    let promises = []
    for (let hash of hashes) {
      promises.push(this._call('getTxData', [hash]))
    }
    const dataArr = await Promise.all(promises)

    promises = []
    for (let data of dataArr) {
      promises.push(this._parseData(data))
    }
    const txs = await Promise.all(promises)

    let map = new Immutable.Map()
    for (let i in hashes) {
      if (hashes.hasOwnProperty(i)) {
        const model = new OperationModel({
          id: 'P-' + hashes[i],
          tx: txs[i].set('time', timestampArr[i].toNumber() * 1000),
          remained: yetNeededArr[i].toNumber(),
          isConfirmed: this._isConfirmed(ownersDoneArr[i])
        })
        map = map.set(model.originId(), model)
      }
    }

    return map
  }

  async getCompletedList () {
    let map = new Immutable.Map()
    const r = await this._get('Done', 0, 'latest', {}, 10)

    const promises = []
    for (let event of r) {
      promises.push(this._parseData(event.args.data))
    }
    const txs = await Promise.all(promises)

    for (let i in r) {
      if (r.hasOwnProperty(i)) {
        const operation = new OperationModel({
          id: r[i].args.hash,
          tx: txs[i].set('time', r[i].args.timestamp * 1000),
          isDone: true
        })
        map = map.set(operation.id(), operation)
      }
    }

    return map
  }

  confirm (operation: OperationModel) {
    return this._tx(TX_CONFIRM, [operation.id()], operation)
  }

  revoke (operation: OperationModel) {
    return this._tx(TX_REVOKE, [operation.id()], operation)
  }

  /**
   * @private
   * @param callback will receive...
   * @see OperationNoticeModel and isOld flag
   * @param isRevoked
   */
  _watchPendingCallback = (callback, isRevoked: boolean = false) => async (result, block, time, isOld) => {
    // noinspection JSUnusedLocalSymbols
    const hash = result.args.hash
    const [data, remained, done, timestamp] = await this._call('getTx', [hash], block)
    const tx = await this._parseData(data)
    const operation = new OperationModel({
      id: PENDING_ID_PREFIX + hash,
      tx: tx ? tx.set('time', timestamp.toNumber() * 1000) : null,
      remained: remained.toNumber(),
      isConfirmed: this._isConfirmed(done)
    })
    if (operation.isCompleted() && !isRevoked) {
      return
    }
    callback(new OperationNoticeModel({
      operation,
      isRevoked,
      time
    }), isOld)
  }

  async watchConfirmation (callback) {
    return this._watch(EVENT_CONFIRMATION, this._watchPendingCallback(callback))
  }

  async watchRevoke (callback) {
    return this._watch(EVENT_REVOKE, this._watchPendingCallback(callback, true))
  }

  async watchDone (callback) {
    return this._watch(EVENT_DONE, (r, block, time, isOld) => {
      if (isOld) {
        return
      }
      this._parseData(r.args.data).then(tx => {
        callback(new OperationModel({
          id: PENDING_ID_PREFIX + r.args.hash,
          tx: tx.set('time', time),
          isDone: true
        }))
      })
    }, false)
  }
  
  watchTxEnd (hash): Promise<boolean> {
    return new Promise(resolve => {
      this._watch(EVENT_DONE, () => resolve(true), false, {hash})
      this._watch(EVENT_CANCELLED, () => resolve(false), false, {hash})
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

  /**
   * @param data
   * @returns {Promise<TransactionExecModel>}
   * @private
   */
  async _parseData (data) {
    for (let dao of this.multisigDAO()) {
      dao = await dao
      const tx = await dao.decodeData(data)
      if (tx !== null) {
        return tx
      }
    }
    console.warn('decode failed for data:', data)
    return null
  }
}
