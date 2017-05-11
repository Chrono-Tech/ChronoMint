import { abstractModel } from './AbstractModel'
import TransactionExecModel from './TransactionExecModel'

class OperationModel extends abstractModel({
  id: null,
  remained: null,
  tx: null,
  isConfirmed: null,
  isFetching: false
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

  /** @return {TransactionExecModel} */
  tx () {
    return this.get('tx')
  }

  remained () {
    return this.get('remained')
  }

  isDone () {
    return !this.remained()
  }

  isConfirmed () {
    return this.get('isConfirmed')
  }

  isFetching () {
    return this.get('isFetching')
  }

  fetching () {
    return this.set('isFetching', true)
  }
}

export default OperationModel
