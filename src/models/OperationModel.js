import React from 'react'
import { Translate } from 'react-redux-i18n'
import { abstractFetchingModel } from './AbstractFetchingModel'
import TxExecModel, { ARGS_TREATED } from './TxExecModel'
import { PENDING_ID_PREFIX } from '../dao/PendingManagerDAO'

class OperationModel extends abstractFetchingModel({
  id: null,
  remained: null,
  completed: null,
  tx: null,
  isConfirmed: false,
  isDone: false
}) {
  constructor (data) {
    super({
      ...data,
      tx: data.tx instanceof TxExecModel ? data.tx : new TxExecModel(data.tx)
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

  summary () {
    const a = this.tx().args()
    const b = {
      operation: <Translate value={this.tx().func()} />
    }
    for (let i in a) {
      if (a.hasOwnProperty(i)) {
        b[this.tx().i18nFunc() + i] = a[i]
      }
    }
    b[ARGS_TREATED] = true // this flag will prevent double substitution of i18n var path
    return b
  }

  mockTxId (id) {
    return this.set('tx', this.tx().set('id', id))
  }
}

export default OperationModel
