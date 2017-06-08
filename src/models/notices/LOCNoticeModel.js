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
    return 'TODO deprecated'
  }
}

export default LOCNoticeModel
