import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'components/common/Moment/index'
import moment from 'moment'
import BigNumber from 'bignumber.js'

export default class Value extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    params: PropTypes.object
  }

  renderValue () {
    const {value, params} = this.props

    if (!value) { // null/undefined
      return ''
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

