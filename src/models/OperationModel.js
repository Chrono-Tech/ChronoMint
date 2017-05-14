import { abstractFetchingModel } from './AbstractFetchingModel'
import TransactionExecModel from './TransactionExecModel'
import { PENDING_ID_PREFIX } from '../dao/OperationsDAO'

class OperationModel extends abstractFetchingModel({
  id: null,
  remained: null,
  tx: null,
  isConfirmed: false,
  isDone: false
}) {
  constructor (data) {
    super({
      ...data,
      tx: data.tx instanceof TransactionExecModel ? data.tx : new TransactionExecModel(data.tx)
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

  /** @returns {TransactionExecModel} */
  tx () {
    return this.get('tx')
  }

  remained () {
    return this.get('remained')
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
}

export default OperationModel
