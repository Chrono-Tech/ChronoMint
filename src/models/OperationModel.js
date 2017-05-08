import { abstractModel } from './AbstractModel'
import TransactionExecModel from './TransactionExecModel'

class OperationModel extends abstractModel({
  id: null,
  remained: null,
  done: null, // TODO bitmap
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

  done () {
    return 1 // TODO bitmap
    // return this.get('done')
  }

  isDone () {
    return !this.remained() || this.done() === true
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

  revoked () {
    return this
      .set('done', this.done() - 1)
      .set('remained', this.remained() + 1)
  }

  confirmed () {
    const self = this
      .set('done', this.done() + 1)
      .set('remained', this.remained() - 1)

    return self.isDone() ? self.set('done', true) : self
  }

  signs () {
    return this.done() + ' / ' + (this.done() + this.remained())
  }
}

export default OperationModel
