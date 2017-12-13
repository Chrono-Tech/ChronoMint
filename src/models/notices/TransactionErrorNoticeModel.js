import { I18n } from 'platform/i18n'
import React from 'react'
import { abstractNoticeModel } from './AbstractNoticeModel'
import { TxError } from '../../dao/AbstractContractDAO'
import type TxExecModel from '../TxExecModel'

export default class TransactionErrorNoticeModel extends abstractNoticeModel({
  tx: null,
  error: null,
}) {
  constructor (tx: TxExecModel, error: TxError) {
    super({ tx, error })
  }

  tx (): TxExecModel {
    return this.get('tx')
  }

  title () {
    return 'Error'
  }

  error (): TxError {
    return this.get('error')
  }

  message () {
    const message = `errorCodes.${this.error().code}`
    return I18n.t(message)
  }

  details () {
    const details = [
      { label: 'Operation', value: I18n.t(this.tx().func()) },
      ...this.tx().details(),
    ]
    const hash = this.tx().hash()
    if (hash) {
      details.push({
        label: 'Hash',
        value: hash,
      })
    }
    return details
  }

  // TODO @ipavlenko: Refactor admin pages and remove
  historyBlock () {
    return this.tx().historyBlock(this._error(), this.date())
  }

  // TODO @ipavlenko: Refactor admin pages and remove
  fullHistoryBlock () {
    return (
      <div>
        {this._error()}
        {this.tx().description(false, { marginTop: '10px' })}
        <p style={{ marginBottom: '0' }}>
          <small>{this.date()}</small>
        </p>
      </div>
    )
  }
}
