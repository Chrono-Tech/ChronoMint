import { I18n } from 'react-redux-i18n'
import React from 'react'
import moment from 'moment'
import uniqid from 'uniqid'

import Moment, { FULL_DATE } from 'components/common/Moment'

import { abstractModel } from '../AbstractModel'

// noinspection JSUnusedLocalSymbols
export const abstractNoticeModel = defaultValues => class AbstractNoticeModel extends abstractModel({ ...defaultValues }) {
  // neither id or time is a default record value
  constructor (data) {
    super({
      id: uniqid(),
      timestamp: Date.now(),
      ...data,
    })
  }

  title () {
    return I18n.t('notices.arbitrary.title')
  }

  address () {
    // Override if suitable
    return null
  }

  // noinspection JSUnusedGlobalSymbols
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
    return this.get('timestamp')
  }

  date () {
    const time = this.time() / 1000
    return time && moment.unix(time) || null
  }

  // TODO @ipavlenko: Refactor admin pages and remove
  historyBlock () {
    return (
      <span>
        {this.message()}
        <small style={{ display: 'block', marginTop: '-25px' }}><Moment date={this.date()} format={FULL_DATE} /></small>
      </span>
    )
  }

  // TODO @ipavlenko: Refactor admin pages and remove
  fullHistoryBlock () {
    return (
      <div>
        {this.message()}
        <p style={{ marginBottom: '0' }}>
          <small><Moment date={this.date()} format={FULL_DATE} /></small>
        </p>
      </div>
    )
  }
}

export default abstractNoticeModel()
