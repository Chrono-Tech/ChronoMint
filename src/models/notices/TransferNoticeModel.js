import { abstractNoticeModel } from './AbstractNoticeModel'
import type TxModel from '../TxModel'

class TransferNoticeModel extends abstractNoticeModel({
  tx: null,
  account: null
}) {
  tx (): TxModel {
    return this.get('tx')
  }

  message () {
    return this.tx().value().toString(10) + ' ' + this.tx().symbol() + ' ' +
      (this.tx().credited ? 'received from ' + this.tx().from : 'sent to ' + this.tx().to)
  }
}

export default TransferNoticeModel
