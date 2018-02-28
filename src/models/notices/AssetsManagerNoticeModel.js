import { I18n } from 'platform/i18n'
import { Icons } from 'platform/icons'
import { abstractNoticeModel } from './AbstractNoticeModel'

export const MANAGER_ADDED = 'managerAdded'
export const MANAGER_REMOVED = 'managerRemoved'

export default class AssetsManagerNoticeModel extends abstractNoticeModel({
  status: null,
  transactionHash: null,
}) {
  icon () {
    return Icons.get('notices.transfer.icon')
  }

  title () {
    return I18n.t('notices.assetsManager.title')
  }

  status () {
    return this.get('status')
  }

  transactionHash (hash) {
    if (hash !== undefined) {
      return this.set('transactionHash', hash)
    }
    return this.get('transactionHash')
  }

  message () {
    const message = `notices.assetsManager.${this.get('status')}`
    return I18n.t(message)
  }
}
