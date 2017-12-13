import { abstractFetchingModel } from './AbstractFetchingModel'
import { PENDING_ID_PREFIX } from '../dao/PendingManagerDAO'
import TxExecModel from './TxExecModel'

class OperationModel extends abstractFetchingModel({
  remained: null,
  completed: null,
  tx: null,
  isConfirmed: false,
  isDone: false,
}) {
  constructor (data) {
    super({
      ...data,
      tx: data.tx instanceof TxExecModel ? data.tx : new TxExecModel(data.tx),
    })
  }

  originId () {
    return this.get('id')
  }

  id () {
    let id = this.originId()
    if (!this.isDone()) {
      id = id.substr(PENDING_ID_PREFIX.length)
    }
    return id
  }

  tx (): TxExecModel {
    return this.get('tx')
  }

  remained () {
    return this.get('remained')
  }

  completed () {
    return this.get('completed')
  }

  isCompleted () {
    return !this.remained()
  }

  isDone () {
    return this.get('isDone')
  }

  isConfirmed () {
    return this.get('isConfirmed')
  }

  isCancelled () {
    return this.isConfirmed() === null
  }

  mockTxId (id) {
    return this.set('tx', this.tx().set('id', id))
  }
}

export default OperationModel
