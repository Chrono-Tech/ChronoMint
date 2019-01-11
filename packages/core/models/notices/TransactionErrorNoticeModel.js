/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TxError from '../TxError'
import { abstractNoticeModel } from './AbstractNoticeModel'
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
    return {
      value: `errorCodes.${this.error().code}`,
    }
  }

  details () {
    const details = [
      { label: 'Operation', value: this.tx().func() },
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
}
