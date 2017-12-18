import BigNumber from 'bignumber.js'
import { I18n } from 'platform/i18n'
import { Icons } from 'platform/icons'
import { abstractNoticeModel } from './AbstractNoticeModel'

export default class ApprovalNoticeModel extends abstractNoticeModel({
  value: new BigNumber(0),
  symbol: null,
  spender: null,
}) {
  title () {
    return I18n.t('notices.approval.title')
  }

  icon () {
    return Icons.get('notices.approval.icon')
  }

  message () {
    return I18n.t('notices.approval.message', {
      value: this.get('value'),
      symbol: this.get('symbol'),
      contractName: this.get('spender'),
    })
  }
}
