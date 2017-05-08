import { Map } from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import UserDAO from './UserDAO'
import ChronoMintDAO from './ChronoMintDAO'
import TokenContractsDAO from './TokenContractsDAO'
import OtherContractsDAO from './OtherContractsDAO'
import VoteDAO from './VoteDAO'
import OperationModel from '../models/OperationModel'
import OperationNoticeModel from '../models/notices/OperationNoticeModel'

// pending and completed
class OperationsDAO extends AbstractContractDAO {
  /**
   * @returns {Array}
   * @private
   */
  _multisigDAO () {
    return [
      UserDAO,
      ChronoMintDAO,
      TokenContractsDAO,
      OtherContractsDAO,
      VoteDAO
    ]
  }

  getList () {
    return new Promise(resolve => {
      this._callNum('pendingsCount').then(total => {
        const promises = []
        for (let i = 0; i < total; i++) {
          promises.push(this._call('getPending', [i])) // index, data, yetNeeded, ownersDone
        }
        Promise.all(promises).then(r => {
          let map = new Map()
          // eslint-disable-next-line
          for (let i in r) {
            // noinspection JSUnfilteredForInLoop
            const model = new OperationModel({
              id: r[i][0],
              tx: this._parseData(r[i][1]),
              remained: r[i][2].toNumber(),
              done: r[i][3].toNumber()
            })
            map = map.set(model.id(), model)
          }
          resolve(map)
        })
      })
    })
  }

  getCompletedList (fromBlock, toBlock) {
    let map = new Map()
    return new Promise(resolve => {
      this.contract.then(deployed => {
        // eslint-disable-next-line new-cap
        deployed['Done']({}, {fromBlock, toBlock}).get((e, r) => {
          if (e || !r.length) {
            return resolve(map)
          }
          r.forEach(log => {
            const operation = new OperationModel({
              id: log.args.operation,
              tx: this._parseData(log.args.data),
              done: true
            })
            map = map.set(operation.id(), operation)
          })
          resolve(map)
        })
      })
    })
  }

  confirm (operation: OperationModel) {
    return this._tx('confirm', [operation.id()])
  }

  revoke (operation: OperationModel) {
    return this._tx('revoke', [operation.id()])
  }

  /**
   * @private
   * @param callback will receive...
   * @see OperationNoticeModel and isOld flag
   * @param isRevoked
   */
  _watchPendingCallback = (callback, isRevoked: boolean = false) => (result, block, time, isOld) => {
    const id = result.args.operation
    this._call('getTxsData', [this._toBytes32(id)]).then(data => {
      if (data === '0x') { // we don't need to notice when required only 1 sign
        return
      }
      UserDAO.getMemberProfile(result.args.owner).then(profile => {
        callback(new OperationNoticeModel({
          operation: new OperationModel({
            id,
            ...this._parseData(data)
          }),
          author: {
            address: result.args.owner,
            profile
          },
          isRevoked,
          time
        }), isOld)
      })
    })
  }

  watchConfirmation (callback) {
    return this._watch('Confirmation', this._watchPendingCallback(callback))
  }

  watchRevoke (callback) {
    return this._watch('Revoke', this._watchPendingCallback(callback, true))
  }

  /**
   * @param data
   * @returns {TransactionExecModel}
   * @private
   */
  _parseData (data) {
    this._multisigDAO() // eslint-disable-next-line
    for (let key in this._multisigDAO()) {
      const tx = this._multisigDAO()[key].decodeData(data)
      if (tx !== null) {
        console.log('PARSE DATA', tx)
        return tx
      }
    }
    throw new Error('parse failed, data: ' + data)
  }
}

export default new OperationsDAO(require('chronobank-smart-contracts/build/contracts/PendingManager.json'))
