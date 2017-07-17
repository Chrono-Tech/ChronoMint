import { abstractNoticeModel } from './AbstractNoticeModel'
import type CBEModel from '../CBEModel'

export default class CBENoticeModel extends abstractNoticeModel({
  cbe: null,
  isRevoked: false
}) {
  cbe (): CBEModel {
    return this.get('cbe')
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  message () {
    return 'CBE ' + this.cbe().address() + ' was ' + (this.isRevoked() ? 'removed' : 'added') + '.'
  }
}
