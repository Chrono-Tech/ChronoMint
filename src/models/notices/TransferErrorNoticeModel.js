import { I18n } from 'platform/i18n'
import TransferError from 'models/TransferError'
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
    return I18n.t('notices.error.title')
  }

  error (): TransferError {
    return this.get('error')
  }

  message () {
    const message = `notices.transfer.errors.${this.error().code}`
    return I18n.t(message)
  }

  details () {
    const transfer = this.tx()
    return [
      { label: 'Operation', value: I18n.t(`notices.transfer.title`) },
      { label: 'Amount', value: `${transfer.amountToken().removeDecimals(transfer.amount()).toString()} ${transfer.amountToken().symbol()}` },
      { label: 'Fee', value: `${transfer.feeToken().removeDecimals(transfer.fee()).toString()} ${transfer.feeToken().symbol()}` },
      { label: 'Hash', value: transfer.hash() },
      { label: 'Message', value: this.error().message },
    ].filter(({ value }) => value != null) // nil check
  }
}
