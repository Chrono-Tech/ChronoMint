import React from 'react'
import moment from 'moment'
import { I18n } from 'react-redux-i18n'
import { abstractModel } from '../AbstractModel'

// noinspection JSUnusedLocalSymbols
export const abstractNoticeModel = defaultValues => class AbstractNoticeModel extends abstractModel({
  time: Date.now(),
  ...defaultValues
}) {

  title () {
    return I18n.t('notices.arbitrary.title')
  }

  address () {
    // Override if suitable
    return null
  }

  subject () {
    // Override if suitable
    return null
  }

  message () {
    throw new Error('should be overridden')
  }

  details () {
    // Array[{ label, value }] with props related to notice
    return null
  }

  icon () {
    return (<i className='material-icons'>error_outline</i>)
  }

  time () {
    return this.get('time')
  }

  date (format) {
    const time = this.time() / 1000
    return time && moment.unix(time).format(format) || null
  }
}

export default abstractNoticeModel()
