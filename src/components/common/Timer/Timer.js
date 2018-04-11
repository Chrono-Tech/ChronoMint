/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'

export default class Timer extends PureComponent {
  static propTypes = {
    time: PropTypes.number.isRequired,
    onEndTimeAction: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      time: props.time,
    }
  }

  componentDidMount () {
    this.interval = setInterval(() => {
      const { time } = this.state
      const { onEndTimeAction } = this.props
      if (time <= 0) {
        clearInterval(this.interval)
        onEndTimeAction()
      } else {
        this.setState({
          time: time - 1,
        })
      }
    }, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    const { time } = this.state
    return (<span>{time} <Translate value='Timer.sec' /></span>)
  }
}
