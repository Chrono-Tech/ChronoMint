import { abstractNoticeModel } from './AbstractNoticeModel'
import CBEModel from '../CBEModel'

class CBENoticeModel extends abstractNoticeModel({
  cbe: null,
  isRevoked: false
}) {
  /** @returns {CBEModel} */
  cbe () {
    return this.get('cbe')
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  message () {
    return 'CBE ' + this.cbe().address() + ' was ' + (this.isRevoked() ? 'removed' : 'added') + '.'
  }
}

export default CBENoticeModel
