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
        let promises = []
        for (let i = 1; i < total; i++) {
          promises.push(this._call('getPending', [i])) // index, data, yetNeeded, ownersDone
        }
        Promise.all(promises).then(r => {
          promises = []
          for (let i in r) {
            if (r.hasOwnProperty(i)) {
              promises.push(this._parseData(r[i][1]))
            }
          }
          Promise.all(promises).then(txs => {
            let map = new Map()
            for (let i in r) {
              if (r.hasOwnProperty(i)) {
                const model = new OperationModel({
                  id: r[i][0],
                  tx: txs[i],
                  remained: r[i][2].toNumber(),
                  isConfirmed: this._isConfirmed(r[i][3])
                })
                map = map.set(model.id(), model)
              }
            }
            resolve(map)
          })
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
          const promises = []
          for (let i in r) {
            if (r.hasOwnProperty(i)) {
              promises.push(this._parseData(r[i].args.data))
            }
          }
          Promise.all(promises).then(txs => {
            for (let i in r) {
              if (r.hasOwnProperty(i)) {
                const operation = new OperationModel({
                  id: r[i].args.operation,
                  tx: txs[i]
                })
                map = map.set(operation.id(), operation)
              }
            }
            resolve(map)
          })
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
    this._call('getPendingByHash', [id]).then(([data, remained, done]) => {
      if (data === '0x') { // prevent notice when operation is already completed
        return
      }
      this._parseData(data).then(tx => {
        callback(new OperationNoticeModel({
          operation: new OperationModel({
            id,
            tx,
            remained: remained.toNumber(),
            isConfirmed: this._isConfirmed(done)
          }),
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

  setMemberId (id) {
    this.memberId = id
  }

  _isConfirmed (bmp) {
    if (this.memberId === null) {
      throw new Error('memberId is not defined')
    }
    return (bmp.toNumber() & (2 ** this.memberId)) !== 0
  }

  /**
   * @param data
   * @returns {TransactionExecModel}
   * @private
   */
  _parseData (data) {
    const promises = []
    for (let i in this._multisigDAO()) {
      if (this._multisigDAO().hasOwnProperty(i)) {
        promises.push(this._multisigDAO()[i].decodeData(data))
      }
    }
    return Promise.all(promises).then(r => {
      for (let tx of r) {
        if (tx !== null) {
          return tx
        }
      }
      return null
    })
  }
}

export default new OperationsDAO(require('chronobank-smart-contracts/build/contracts/PendingManager.json'))
