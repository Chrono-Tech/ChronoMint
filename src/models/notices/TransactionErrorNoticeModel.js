import { I18n } from 'platform'
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
}
