import { I18n, ImageProvider } from 'platform'
import { abstractNoticeModel } from './AbstractNoticeModel'

const ADDED = 'notices.locs.added'
const REMOVED = 'notices.locs.removed'
const UPDATED = 'notices.locs.updated'
const STATUS_UPDATED = 'notices.locs.statusUpdated'
const ISSUED = 'notices.locs.issued'
const REVOKED = 'notices.locs.revoked'
const FAILED = 'notices.locs.failed'

export const statuses = {
  ADDED,
  REMOVED,
  UPDATED,
  STATUS_UPDATED,
  ISSUED,
  REVOKED,
  FAILED,
}

export default class LOCNoticeModel extends abstractNoticeModel({
  action: null,
  name: null,
  amount: null,
}) {
  icon () {
    return ImageProvider.getImage('LOCNoticeModel')
  }

  title () {
    return I18n.t('notices.locs.title')
  }

  // noinspection JSUnusedGlobalSymbols
  details () {
    const amount = this.get('amount')
    return amount
      ? [
        { label: I18n.t('notices.locs.details.amount'), value: `${amount}` },
      ]
      : null
  }

  message () {
    return I18n.t(this.get('action'), {
      name: this.get('name'),
    })
  }
}
