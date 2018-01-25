import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { FULL_DATE }  from 'models/constants'

const mapStateToProps = (state) => ({
  locale: state.get('i18n').locale,
})

@connect(mapStateToProps)
class Moment extends PureComponent {
  static propTypes = {
    locale: PropTypes.string,
    date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.instanceOf(Date),
    ]),
    format: PropTypes.string,
    action: PropTypes.string,
    parseFormat: PropTypes.string,
  }

  static defaultProps = {
    format: FULL_DATE,
  }

  render () {
    const {
      locale, date, format, action, parseFormat,
    } = this.props

    let view
    if (action) {
      view = moment(date, parseFormat).locale(locale)[action]()
    } else {
      view = moment(date, parseFormat).locale(locale).format(format)
    }

    return <span>{view}</span>
  }
}

export default Moment
