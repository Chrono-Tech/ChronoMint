import { I18n } from 'react-redux-i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type OperationModel from '../OperationModel'

const CONFIRMED = 'notices.locs.added'
const CANCELLED = 'notices.locs.removed'
const REVOKED = 'notices.locs.statusUpdated'
const DONE = 'notices.locs.updated'

export const statuses = {
  CONFIRMED,
  CANCELLED,
  REVOKED,
  DONE
}

export default class OperationNoticeModel extends abstractNoticeModel({
  operation: null,
  isRevoked: false
}) {
  operation (): OperationModel {
    return this.get('operation')
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  _status () {
    if (this.operation().isCancelled()) {
      return CANCELLED
    } else if (this.operation().isDone()) {
      return DONE
    } else if (this.isRevoked()) {
      return REVOKED
    }
    return CONFIRMED
  }

  message () {
    return I18n.t(this._status(), {
      remained: this.operation().remained()
    })
  }

  details () {
    const details = [
      { label: 'Operation', value: this.tx().func() },
      ...this.tx().details()
    ]
    const hash = this.tx().hash()
    if (hash) {
      details.push({
        label: 'Hash',
        value: hash
      })
    }
    return details
  }
}
