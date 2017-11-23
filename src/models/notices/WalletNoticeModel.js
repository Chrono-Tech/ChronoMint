import { I18n, ImageProvider } from 'platform'
import { abstractNoticeModel } from './AbstractNoticeModel'

const CREATED = 'notices.wallet.created'
// const ADDED = 'notices.locs.added'
// const REMOVED = 'notices.locs.removed'
// const UPDATED = 'notices.locs.updated'
// const ISSUED = 'notices.locs.issued'
// const REVOKED = 'notices.locs.revoked'
// const FAILED = 'notices.locs.failed'

export const statuses = {
  CREATED,
  // ADDED,
  // REMOVED,
  // UPDATED,
  // ISSUED,
  // REVOKED,
  // FAILED
}

export default class WalletNoticeModel extends abstractNoticeModel({
  action: null,
  address: null,
}) {

  icon () {
    return ImageProvider.get('WalletNoticeModel')
  }

  title () {
    return I18n.t('notices.wallet.title')
  }

  // noinspection JSUnusedGlobalSymbols
  details () {
    return null
  }

  message () {
    return I18n.t(this.get('action'), {
      address: this.get('address'),
    })
  }
}
