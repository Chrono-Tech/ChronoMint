/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import TwoFaEnableForm from 'components/wallet/TwoFaEnableForm/TwoFaEnableForm'
import './TwoFAContent.scss'

const mapStateToProps = (state, ownProps) => {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class TwoFAContent extends Component {
  static propTypes = {}

  render () {
    return (
      <div styleName='root'>
        <TwoFaEnableForm />
      </div>
    )
  }
}
