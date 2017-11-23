import { I18n, ImageProvider } from 'platform'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type CBEModel from '../CBEModel'

export default class CBENoticeModel extends abstractNoticeModel({
  cbe: null,
  isRevoked: false,
}) {
  cbe (): CBEModel {
    return this.get('cbe')
  }

  icon () {
    return ImageProvider.getImage('CBENoticeModel')
  }

  title () {
    return I18n.t('notices.settings.title')
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  message () {
    return this.isRevoked()
      ? I18n.t('notices.cbe.removed', { address: this.cbe().address() })
      : I18n.t('notices.cbe.added', { address: this.cbe().address() })
  }
}
