import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { Translate } from 'react-redux-i18n'

import './PlatformInfo.scss'

function prefix (token) {
  return 'Assets.PlatformsList.' + token
}

export class PlatformInfo extends Component {

  static propTypes = {}

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
        </div>
      </div>
    )
  }
}

function mapStateToProps (/*state*/) {
  return {}
}

function mapDispatchToProps (/*dispatch*/) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatformInfo)
