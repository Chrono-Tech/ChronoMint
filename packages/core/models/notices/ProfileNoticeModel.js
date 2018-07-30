/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import PropTypes from 'prop-types'
import { I18n } from '@chronobank/core-dependencies/i18n'
import { Icons } from '@chronobank/core-dependencies/icons'
import ProfileModel from '../ProfileModel'
import AbstractModel from '../../refactor/models/AbstractModel'

const schemaFactory = () => ({
  profile: PropTypes.instanceOf(ProfileModel),
})

const defaultProps = {
  profile: null,
}

class ProfileNoticeModel extends AbstractModel {
  constructor (ownProps) {
    const props = { ...defaultProps, ...ownProps }
    super({ ...props }, schemaFactory())
    Object.freeze(this)
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

export default ProfileNoticeModel
