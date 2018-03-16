import { I18n } from 'platform/i18n'
import { Icons } from 'platform/icons'
import ProfileModel from 'models/ProfileModel'
import { abstractNoticeModel } from './AbstractNoticeModel'

export default class ProfileNoticeModel extends abstractNoticeModel({
  profile: null,
}) {
  profile (): ProfileModel {
    return this.get('profile')
  }

  icon () {
    return Icons.get('notices.settings.icon')
  }

  title () {
    return I18n.t('notices.settings.title')
  }

  message () {
    return I18n.t('notices.profile.changed')
  }
}
