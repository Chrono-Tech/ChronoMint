import { abstractFetchingModel } from './AbstractFetchingModel'
import TransactionExecModel from './TransactionExecModel'

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

  id () {
    return this.get('id')
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
