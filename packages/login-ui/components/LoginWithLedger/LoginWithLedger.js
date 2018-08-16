/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import ChevronRight from '@material-ui/icons/ChevronRight'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import {
  DUCK_DEVICE_ACCOUNT,
} from '@chronobank/core/redux/device/constants'

import './LoginWithLedger.scss'

const mapStateToProps = (state) => {
  return {
    isLoading: state.get(DUCK_DEVICE_ACCOUNT).isLoading,
    accounts: state.get(DUCK_DEVICE_ACCOUNT).deviceList,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fetchAccount: () => dispatch(fetchAccount()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class LoginWithLedger extends PureComponent {
  static propTypes = {
    fetchAccount: PropTypes.func,
    onBack: PropTypes.func,
    previousPage: PropTypes.func,
    isLoading: PropTypes.bool,
    accounts: PropTypes.instanceOf(Array),
    onDeviceSelect: PropTypes.func,
  }

  componentDidUpdate (prevProps) {
    //if (!this.props.trezor.isFetched && !this.props.trezor.isFetching) {
    //  this.props.fetchAccount()
    //}
  }

  componentWillUnmount () {
  }

  handleChange = (event, index, value) => {
    this.setState({ value })
    ledgerProvider.setWallet(this.props.account[index])
    this.props.selectAccount(this.props.account[index])
  }

  renderStates () {
    return (
      <div styleName='state' key='1'>
        <div styleName='titleContent'>
          <div styleName='title'>zzz</div>
          <div styleName='subtitle'>zzz</div>
        </div>
      </div>
    )
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

  render () {
    const { previousPage, accounts, isLoading, navigateToDerivationPathForm } = this.props
    console.log('isLoading')
    console.log(isLoading)
    return (
      <div styleName='form'>
        <div styleName='page-title'>
          <Translate value='LoginWithLedger.title' />
        </div>
        {
          !isLoading && (
            <div styleName='states'>
              {this.renderStates()}
            </div>
          )
        }

        {
          isLoading && (
            <div styleName='account'>
              {accounts.map(this._buildItem)}
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
