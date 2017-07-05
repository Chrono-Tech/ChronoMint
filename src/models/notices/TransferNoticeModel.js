import { abstractNoticeModel } from './AbstractNoticeModel'
import type TransactionModel from '../TransactionModel'

class TransferNoticeModel extends abstractNoticeModel({
  tx: null,
  account: null
}) {
  tx (): TransactionModel {
    return this.get('tx')
  }

  message () {
    return this.tx().value() + ' ' + this.tx().symbol() + ' ' +
      (this.tx().credited ? 'received from ' + this.tx().from : 'sent to ' + this.tx().to)
  }
}

export default TransferNoticeModel
