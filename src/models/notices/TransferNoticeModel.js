import { abstractNoticeModel } from './AbstractNoticeModel'
import TransactionModel from '../TransactionModel'

class TransferNoticeModel extends abstractNoticeModel({
  tx: null,
  account: null
}) {
  /** @returns {TransactionModel} */
  tx () {
    return this.get('tx')
  }

  message () {
    return this.tx().value() + ' ' + this.tx().symbol() + ' ' +
      (this.tx().credited ? 'received from ' + this.tx().from : 'sent to ' + this.tx().to)
  }
}

export default TransferNoticeModel
