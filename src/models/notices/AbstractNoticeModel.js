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
    return time && moment.unix(time).format(format || 'HH:mm, MMMM Do, YYYY') || null
  }

  historyBlock () {
    return (
      <span>
        {this.message()}
        <small style={{display: 'block', marginTop: '-25px'}}>{this.date()}</small>
      </span>
    )
  }

  fullHistoryBlock () {
    return (
      <div>
        {this.message()}
        <p style={{marginBottom: '0'}}>
          <small>{this.date()}</small>
        </p>
      </div>
    )
  }
}

export default abstractNoticeModel()
