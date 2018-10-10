/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import './LoginWithMetamask.scss'

class LoginWithMetamask extends Component {

  static propTypes = {
    previousPage: PropTypes.func,
    deviceList: PropTypes.instanceOf(Array),
    onDeviceSelect: PropTypes.func,
  }

  _buildItem = (item, i) => {
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

  renderStates () {
    return (
      <div styleName='state' key='1'>
        <div styleName='titleContent'>
          <div styleName='title'>Metamask not found</div>
          <div styleName='subtitle'>Connect your Metamask</div>
        </div>
      </div>
    )
  }

  render () {
    const { previousPage, deviceList } = this.props
    return (
      <div styleName='form'>
        <div styleName='page-title'>
          <Translate value='LoginWithMetamask.title' />
        </div>
        {
          !deviceList.length && (
            <div styleName='states'>
              {this.renderStates()}
            </div>
          )
        }

        {
          deviceList.length > 0 && (
            <div styleName='account'>
              {deviceList.map(this._buildItem)}
            </div>
          )
        }

        <div styleName='actions'>
          <button onClick={previousPage} styleName='link'>
            <Translate value='LoginWithMetamask.back' />
          </button>
        </div>
      </div>
    )
  }
}

export default LoginWithMetamask
