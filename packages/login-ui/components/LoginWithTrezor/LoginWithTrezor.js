/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import './LoginWithTrezor.scss'
import TrezorAddress from './TrezorAddress'

class LoginWithTrezor extends Component {
  static propTypes = {
    previousPage: PropTypes.func,
    deviceList: PropTypes.instanceOf(Array),
    onDeviceSelect: PropTypes.func,
    navigateToDerivationPathForm: PropTypes.func,
  }

  renderError () {
    return (
      <div styleName='state' key='1'>
        <div styleName='titleContent'>
          <div styleName='title'>Trezor not found</div>
          <div styleName='subtitle'>Connect your Trezor</div>
        </div>
      </div>
    )
  }

  renderLoading () {
    return (
      <div styleName='stateLoading' key='1'>
        <div styleName='titleContent'>
          <div styleName='title'>Loading</div>
        </div>
      </div>
    )
  }

  render () {
    const { previousPage, deviceList, navigateToDerivationPathForm, onDeviceSelect } = this.props

    return (
      <div styleName='form'>
        <div styleName='page-title'>
          <Translate value='LoginWithTrezor.title' />
        </div>
        {
          !deviceList.length && (
            <div styleName='states'>
              {this.renderLoading()}
            </div>
          )
        }

        {
          deviceList.length > 0 && (
            <div styleName='account'>
              {deviceList.map((item, i) => {
                return (<TrezorAddress
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
          <button onClick={navigateToDerivationPathForm} styleName='link'>
            <Translate value='LoginWithTrezor.enterPath' />
          </button>
          <br />

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

export default LoginWithTrezor
