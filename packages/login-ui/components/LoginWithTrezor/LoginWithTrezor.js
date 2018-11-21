/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import './LoginWithTrezor.scss'

class LoginWithTrezor extends Component {
  static propTypes = {
    previousPage: PropTypes.func,
    deviceList: PropTypes.instanceOf(Array),
    onDeviceSelect: PropTypes.func,
    navigateToDerivationPathForm: PropTypes.func,
  }

  renderDeviceItem = (item, i) => {
    console.log('renderDeviceItem: ', item, i)

    return (
      <div
        key={i}
        onClick={() => this.props.onDeviceSelect(item)}
        styleName='account-item'
      >
        <div styleName='account-item-content'>
          <div styleName='account-item-address'>
            { item.address }
          </div>
          <div styleName='account-item-additional'>
            {/* Wallet balance field*/}
            ETH 1.00
          </div>
        </div>
        <div styleName='account-item-icon'>
          <div className='chronobank-icon'>next</div>
        </div>
      </div>
    )
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
      <div styleName='state' key='1'>
        <div styleName='titleContent'>
          <div styleName='title'>Loading</div>
        </div>
      </div>
    )
  }

  render () {
    const { previousPage, deviceList, navigateToDerivationPathForm } = this.props

    console.log('LoginWithTrezor deviceList: ', deviceList)

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
              {deviceList.map(this.renderDeviceItem)}
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
