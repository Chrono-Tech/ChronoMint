/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TransferError from '../TransferError'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type TransferExecModel from '../TransferExecModel'

export default class TransferErrorNoticeModel extends abstractNoticeModel({
  tx: null,
  error: null,
}) {
  constructor (tx: TransferExecModel, error: TransferError) {
    super({ tx, error })
  }

  tx (): TransferExecModel {
    return this.get('tx')
  }

  title () {
    return 'notices.error.title'
  }

  error (): TransferError {
    return this.get('error')
  }

  message () {
    return {
      value: `notices.transfer.errors.${this.error().code}`,
    }
  }

  details () {
    const transfer = this.tx()
    return [
      { label: 'Operation', value: `notices.transfer.title` },
      { label: 'Amount', value: `${transfer.amountToken().removeDecimals(transfer.amount()).toString()} ${transfer.amountToken().symbol()}` },
      { label: 'Fee', value: `${transfer.feeToken().removeDecimals(transfer.fee().mul(transfer.feeMultiplier())).toString()} ${transfer.feeToken().symbol()}` },
      { label: 'Hash', value: transfer.hash() },
      { label: 'Message', value: this.error().message },
    ].filter(({ value }) => value != null) // nil check
  }
}
