import { Map } from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import UserDAO from './UserDAO'
import LOCsManagerDAO from './LOCsManagerDAO'
import LS from './LocalStorageDAO'
import TokenContractsDAO from './TokenContractsDAO'
import OtherContractsDAO from './OtherContractsDAO'
import VoteDAO from './VoteDAO'
import OperationModel from '../models/OperationModel'
import OperationNoticeModel from '../models/notices/OperationNoticeModel'

class OperationsDAO extends AbstractContractDAO {
  /**
   * @returns {Array}
   * @private
   */
  _multisigDAO () {
    return [
      UserDAO,
      LOCsManagerDAO,
      TokenContractsDAO,
      OtherContractsDAO,
      VoteDAO
    ]
  }

  getList () {
    return new Promise(resolve => {
      this._callNum('pendingsCount').then(total => {
        let promises = []
        for (let i = 1; i <= total; i++) {
          promises.push(this._call('getPending', [i])) // hash, data, yetNeeded, ownersDone, timestamp
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
                  tx: txs[i].set('time', r[i][4] * 1000),
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
                  id: r[i].args.hash,
                  tx: txs[i].set('time', r[i].args.timestamp * 1000),
                  isDone: true
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
    this._call('getPending', [result.args.id]).then(([hash, data, remained, done, timestamp]) => {
      if (data === '0x') { // prevent notice when operation is already completed
        return
      }
      this._parseData(data).then(tx => {
        const operation = new OperationModel({
          id: hash,
          tx: tx.set('time', timestamp * 1000),
          remained: remained.toNumber(),
          isConfirmed: this._isConfirmed(done)
        })
        if (operation.isCompleted()) {
          return
        }
        callback(new OperationNoticeModel({
          operation,
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

  watchDone (callback) {
    return this._watch('Done', (r, block, time, isOld) => {
      if (isOld) {
        return
      }
      this._parseData(r.args.data).then(tx => {
        callback(new OperationModel({
          id: r.args.hash,
          tx: tx.set('time', time),
          isDone: true
        }))
      })
    }, Math.random())
  }

  watchError (callback) {
    return this._watch('Error', (r, block, time, isOld) => {
      if (isOld) {
        return
      }
      this.web3.eth.getTransaction(r.transactionHash, (e, txData) => {
        if (!e && txData.from === LS.getAccount()) {
          callback(this._bytesToString(r.args.message))
        }
      })
    }, Math.random())
  }

  setMemberId (id) {
    this.memberId = id
  }

  /**
   * Returns 'is confirmed by authorized user' flag or null for cancelled operation.
   * @param bmp
   * @returns {boolean|null} null for cancelled
   * @private
   */
  _isConfirmed (bmp) {
    if (this.memberId === null) {
      throw new Error('memberId is not defined')
    }
    bmp = bmp.toNumber()
    if (!bmp) {
      return null
    }
    return (bmp & (2 ** this.memberId)) !== 0
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
      console.warn('decode failed for data:', data)
      return null
    })
  }
}

export default new OperationsDAO(require('chronobank-smart-contracts/build/contracts/PendingManager.json'))
