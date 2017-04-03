import {abstractNoticeModel} from './AbstractNoticeModel'
import PendingOperation from '../PendingOperation'

class PendingOperationNoticeModel extends abstractNoticeModel({
  pending: null,
  revoke: false
}) {
  constructor (data) {
    super({
      ...data,
      pending: data.pending instanceof PendingOperation ? data.pending : new PendingOperation(data.pending)
    })
  }

  message () {
    return 'Pending operation "' + this.get('pending').get('operation') + '" ' +
      (this.get('revoke') ? 'was revoked.' : 'was confirmed.')
  };
}

export default PendingOperationNoticeModel
