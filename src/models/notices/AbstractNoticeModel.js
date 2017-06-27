import React from 'react'
import { abstractModel } from '../AbstractModel'
import { dateFormatOptions } from '../../config'

// noinspection JSUnusedLocalSymbols
export const abstractNoticeModel = defaultValues => class AbstractNoticeModel extends abstractModel({
  time: Date.now(),
  ...defaultValues
}) {
  constructor (data) {
    if (new.target === AbstractNoticeModel) {
      throw new TypeError('Cannot construct AbstractNoticeModel instance directly')
    }
    super(data)
  }

  message () {
    throw new Error('should be overridden')
  }

  /**
   * Should return JSX component with icon of notice.
   * TODO @bshevchenko: implement this
   */
  icon () {
    throw new Error('should be overridden')
  }

  time () {
    return this.get('time')
  }

  date () {
    let date = new Date(this.time())
    return date.toLocaleDateString(undefined, dateFormatOptions) + ' ' + date.toTimeString().substr(0, 5)
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
