/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import PropTypes from 'prop-types'
import ProfileModel from '../ProfileModel'
import AbstractModel from '../AbstractModelOld'

const schemaFactory = () => ({
  profile: PropTypes.instanceOf(ProfileModel),
})

class ProfileNoticeModel extends AbstractModel {
  constructor (ownProps) {
    const defaultProps = {
      profile: null,
    }
    const props = { ...defaultProps, ...ownProps }
    super({ ...props }, schemaFactory())
    Object.freeze(this)
  }

  icon () {
    return 'notices.settings.icon'
  }

  title () {
    return 'notices.settings.title'
  }

  message () {
    return {
      value: 'notices.profile.changed',
    }
  }
}

export default ProfileNoticeModel
