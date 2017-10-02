import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'components/common/Moment/index'

export default class UniRender extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    type: PropTypes.string, // required for types object
    format: PropTypes.string // for type date or moment or bigNumber
  }

  renderValue () {
    const {value, type, format} = this.props

    if (!value) { // null/undefined
      return ''
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return value
    }

    if (Array.isArray(value)) {
      return value.join(`, `)
    }

    if (typeof value === 'object') {
      switch (type) {
        case 'date':
          return <Moment date={value} format={format} />
        case 'bigNumber':
          return value.toString() // format = number
      }
    }

    // for other types
    return value
  }

  render () {
    return <span>{this.renderValue()}</span>
  }

}
