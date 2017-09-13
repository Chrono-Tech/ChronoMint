import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'

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
  }

  render () {
    const {locale, date, format} = this.props

    return <span>{moment(date).locale(locale).format(format)}</span>
  }
}

export default Moment
