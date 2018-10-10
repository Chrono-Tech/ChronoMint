/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'

import './LoginWithLedger.scss'

class LoginWithLedger extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
    onDeviceSelect: PropTypes.func,
    deviceList: PropTypes.instanceOf(Array),
    navigateToDerivationPathForm: PropTypes.func,
  }

  componentWillUnmount () {
  }

  handleDeviceSelect = (item) => () => {
    this.props.onDeviceSelect(item)
  }

  _buildItem = (item, i) => {
    return (
      <div
        key={i}
        onClick={this.handleDeviceSelect(item)}
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
          <div styleName='title'>Ledger not found</div>
          <div styleName='subtitle'>Connect your Ledger</div>
        </div>
      </div>
    )
  }

  render () {
    const { previousPage, deviceList, navigateToDerivationPathForm } = this.props
    return (
      <div styleName='form'>
        <div styleName='page-title'>
          <Translate value='LoginWithLedger.title' />
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
          <button onClick={navigateToDerivationPathForm} styleName='link'>
            <Translate value='LoginWithLedger.enterPath' />
          </button>
          <br />

          <Translate value='LoginWithLedger.or' />
          <br />
          <button onClick={previousPage} styleName='link'>
            <Translate value='LoginWithLedger.back' />
          </button>
        </div>
      </div>
    )
  }
}

export default LoginWithLedger
