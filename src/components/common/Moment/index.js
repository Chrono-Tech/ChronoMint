import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'

export const FULL_DATE = 'HH:mm, MMMM Do, YYYY'
export const SHORT_DATE = 'MMM Do, YYYY'

const mapStateToProps = (state) => {
  return {
    locale: state.get('i18n').locale,
  }
}

@connect(mapStateToProps)
class Moment extends React.Component {
  static propTypes = {
    locale: PropTypes.string,
    date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    format: PropTypes.string,
    parseFormat: PropTypes.string
  }

  render () {
    const {locale, date, format, parseFormat} = this.props
    const parsedDate = parseFormat ? moment(date, parseFormat) : moment(date)


    if (!parsedDate.isValid()) {
      return null
    }

    return <span>{parsedDate.locale(locale).format(format)}</span>
  }
}

export default Moment
