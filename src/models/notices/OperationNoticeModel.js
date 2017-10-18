import React from 'react'
import { I18n } from 'react-redux-i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type OperationModel from '../OperationModel'
import type TxExecModel from '../TxExecModel'

const CONFIRMED = 'notices.operations.confirmed'
const CANCELLED = 'notices.operations.cancelled'
const REVOKED = 'notices.operations.revoked'
const DONE = 'notices.operations.done'

export default class OperationNoticeModel extends abstractNoticeModel({
  operation: null,
  isRevoked: false,
}) {
  operation(): OperationModel {
    return this.get('operation')
  }

  isRevoked() {
    return this.get('isRevoked')
  }

  icon() {
    return (<i className='material-icons'>alarm</i>)
  }

  title() {
    return I18n.t('notices.operations.title')
  }


  _status() {
    if (this.operation().isCancelled()) {
      return CANCELLED
    } else if (this.operation().isDone()) {
      return DONE
    } else if (this.isRevoked()) {
      return REVOKED
    }
    return CONFIRMED
  }

  message() {
    return I18n.t(this._status(), {
      remained: this.operation().remained(),
    })
  }

  tx(): TxExecModel {
    return this.operation().tx()
  }

  // TODO @bshevchenko: remove noinspection
  // noinspection JSUnusedGlobalSymbols
  details() {
    const details = [
      { label: I18n.t('notices.operations.details.operation'), value: I18n.t(this.tx().func()) },
      ...this.tx().details(),
    ]
    const hash = this.tx().hash()
    if (hash) {
      details.push({
        label: I18n.t('notices.operations.details.hash'),
        value: hash,
      })
    }
    return details
  }

  // TODO @ipavlenko: Refactor admin pages and remove
  historyBlock() {
    return this.operation().tx().historyBlock(this._status(), this.date())
  }

  // TODO @ipavlenko: Refactor admin pages and remove
  fullHistoryBlock() {
    return (
      <div>
        {this._status()}
        {this.operation().tx().description(false, { marginTop: '10px' })}
        <p style={{ marginBottom: '0' }}>
          <small>{this.date()}</small>
        </p>
      </div>
    )
  }
}
