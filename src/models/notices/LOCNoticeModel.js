import { abstractNoticeModel } from './AbstractNoticeModel'
import LOCModel from '../LOCModel'

export const ADDED = 'ADDED'
export const REMOVED = 'REMOVED'
export const UPDATED = 'UPDATED'

class LOCNoticeModel extends abstractNoticeModel({
  action: null,
  loc: null,
  params: null
}) {
  constructor (data) {
    super({
      ...data,
      loc: data.loc instanceof LOCModel ? data.loc : new LOCModel(data.loc)
    })
  }

  message () {
    switch (this.get('action')) {
      case ADDED:
        return 'LOC "' + this.get('loc').name() + '" Added'
      case REMOVED:
        return 'LOC "' + this.get('loc').name() + '" Removed'
      case UPDATED:
      default:
        let val = this.get('params').value
        if (this.get('params').valueName === 'issueLimit' || this.get('params').valueName === 'issued') {
          val /= 100000000
        }
        return 'LOC "' + this.get('loc').name() + '" Updated. New ' +
          this.get('params').valueName + ' = ' + val
    }
  };
}

export default LOCNoticeModel
