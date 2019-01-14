/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import moment from 'moment/moment'
import DatePicker from 'material-ui-pickers/DatePicker'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider'

import './style.scss'

export default class DatePickerWrapper extends PureComponent {

  handleChange = (d) => {
    return this.props.input.onChange(d.toDate())
  }

  render () {
    const { input, ...props } = this.props
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          {...props}
          value={input.value ? moment(input.value) : null}
          onChange={this.handleChange}
        />
      </MuiPickersUtilsProvider>
    )
  }
}
