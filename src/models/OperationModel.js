import { abstractFetchingModel } from './AbstractFetchingModel'
import TransactionExecModel, { ARGS_TREATED } from './TransactionExecModel'
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

  summary () {
    const a = this.tx().args()
    const b = {}
    for (let i in a) {
      if (a.hasOwnProperty(i)) {
        b[this.tx().i18nFunc() + i] = a[i]
      }
    }
    b[ARGS_TREATED] = true // this flag will prevent double substitution of i18n var path
    return b
  }
}

export default OperationModel
