/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { I18n } from '@chronobank/core-dependencies/i18n'
import { Icons } from '@chronobank/core-dependencies/icons'
import ProfileModel from '../ProfileModel'
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
