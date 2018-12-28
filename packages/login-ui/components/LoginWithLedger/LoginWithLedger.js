/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import {
  STATE_LOADING,
  STATE_ERROR,
} from '@chronobank/core/redux/device/constants'
import LedgerAddress from './LedgerAddress'

import './LoginWithLedger.scss'

class LoginWithLedger extends Component {
  static propTypes = {
    previousPage: PropTypes.func,
    deviceList: PropTypes.instanceOf(Array),
    deviceState: PropTypes.string,
    onDeviceSelect: PropTypes.func,
    navigateToDerivationPathForm: PropTypes.func,
  }

  renderError () {
    return (
      <div styleName='state'>
        <div styleName='titleContent'>
          <div styleName='title'><Translate value='LoginWithTrezor.ledgerNotFound' /></div>
          <div styleName='subtitle'><Translate value='LoginWithTrezor.connectYourLedger' /></div>
        </div>
      </div>
    )
  }

  renderLoading () {
    return (
      <div styleName='stateLoading'>
        <div styleName='titleContent'>
          <div styleName='title'><Translate value='LoginWithTrezor.loading' /></div>
        </div>
      </div>
    )
  }

  renderState () {
    switch (this.props.deviceState) {
      case STATE_LOADING:
        return this.renderLoading()

      case STATE_ERROR:
        return this.renderError()
    }
  }

  render () {
    const { previousPage, deviceList, onDeviceSelect } = this.props

    return (
      <div styleName='form'>
        <div styleName='page-title'>
          <Translate value='LoginWithTrezor.title' />
        </div>
        <div styleName='states'>
          {this.renderState()}
        </div>

        {
          deviceList.length > 0 && (
            <div styleName='account'>
              {deviceList.map((item, i) => {
                return (<LedgerAddress
                  key={item.address}
                  entryModel={item}
                  childKey={i}
                  onDeviceSelect={onDeviceSelect}
                />)
              })}
            </div>
          )
        }

        <div styleName='actions'>

          <Translate value='LoginWithTrezor.or' />
          <br />

          <button onClick={previousPage} styleName='link'>
            <Translate value='LoginWithTrezor.back' />
          </button>
        </div>
      </div>
    )
  }
}

export default LoginWithLedger
