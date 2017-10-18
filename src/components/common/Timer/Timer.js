import PropTypes from 'prop-types'
import React from 'react'
import { Translate } from 'react-redux-i18n'

export default class Timer extends React.Component {
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
