import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import moment from 'moment'

import Amount from 'models/Amount'

import Moment from 'components/common/Moment/index'
import TokenValue from 'components/common/TokenValue/TokenValue'

export default class Value extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    params: PropTypes.object,
  }

  renderValue () {
    const { value, params = {} } = this.props

    if (value === null && value === undefined) { // null/undefined
      return ''
    }

    if (typeof value === 'boolean') {
      return <Translate value={value.toString()} />
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return value
    }

    if (Array.isArray(value)) {
      return value.join(`, `)
    }

    if (value instanceof moment || value instanceof Date) {
      return <Moment date={value} {...params} />
    }

    if (value instanceof Amount) {
      return (<TokenValue
        value={value}
        symbol={value.symbol()}
        {...params}
      />)
    }

    if (value instanceof BigNumber) {
      return value.toString(params.length)
    }

    // for other types
    return value
  }

  render () {
    return <span>{this.renderValue()}</span>
  }
}

