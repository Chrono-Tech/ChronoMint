import { I18n } from 'react-redux-i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'

const ADDED = 'notices.locs.added'
const REMOVED = 'notices.locs.removed'
const UPDATED = 'notices.locs.updated'
const STATUS_UPDATED = 'notices.locs.statusUpdated'
const ISSUED = 'notices.locs.issued'
const FAILED = 'notices.locs.failed'

export const statuses = {
  ADDED,
  REMOVED,
  UPDATED,
  STATUS_UPDATED,
  ISSUED,
  FAILED
}

export default class LOCNoticeModel extends abstractNoticeModel({
  action: null,
  name: null
}) {
  id () {
    return `${this.time()} - ${Math.random()}`
  }

  message () {
    return I18n.t(this.get('action'), {
      name: this.get('name')
    })
  }
}
