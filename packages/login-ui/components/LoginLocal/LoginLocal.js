/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import {
  LOCAL_ID,
  TESTRPC_URL,
  LOCAL_PROVIDER_ID
} from '@chronobank/login/network/settings'
import { MuiThemeProvider } from 'material-ui'
import {
  DUCK_NETWORK,
  onSubmitLoginTestRPC,
  onSubmitLoginTestRPCFail,
  initLoginLocal,
  selectProviderWithNetwork,
  handleLoginLocalAccountClick,
} from '@chronobank/login/redux/network/actions'
import web3Provider from '@chronobank/login/network/Web3Provider'
import PropTypes from 'prop-types'
import Button from 'components/common/ui/Button/Button'
import UserRow from 'components/common/ui/UserRow/UserRow'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'

import styles from 'layouts/Splash/styles'
import spinner from 'assets/img/spinningwheel-1.gif'
import './LoginLocal.scss'

export const FORM_LOGIN_TEST_RPC = 'FormLoginTestRPCPage'

const mapDispatchToProps = (dispatch) => ({
  onSubmit: async (values) => {

    await dispatch(onSubmitLoginTestRPC())
  },
  onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitLoginTestRPCFail(errors, dispatch, submitErrors)),
  selectAccount: (value) => networkService.selectAccount(value),
  initLoginLocal: () => dispatch(initLoginLocal()),
  handleLoginLocalAccountClick: (account) => dispatch(handleLoginLocalAccountClick(account)),
})

const mapStateToProps = (state) => {
  const network = state.get(DUCK_NETWORK)
  return {
    isLoginSubmitting: network.isLoginSubmitting,
    accounts: network.accounts,
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class LoginLocal extends PureComponent {
  static propTypes = {
    onLogin: PropTypes.func,
    selectAccount: PropTypes.func,
    initLoginLocal: PropTypes.func,
    handleLoginLocalAccountClick: PropTypes.func,
    isLoginSubmitting: PropTypes.bool,
  }

  componentWillMount(){
    this.props.initLoginLocal()
  }

  renderRPCSelectorMenuItem(item, i){
    return (
      <div
        key={i}
        onClick={() => this.props.handleLoginLocalAccountClick(item)}
        styleName='account-item'
      >
        <div styleName='account-item-content'>
          { item }
        </div>
        <div styleName='account-item-icon'>
          <div className='chronobank-icon'>next</div>
        </div>
      </div>
    )
  }

  render () {
    const { handleSubmit, isLoginSubmitting, error, accounts, selectedAccount } = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <div styleName='wrapper'>

          <div styleName='page-title'>
            <Translate value='LoginForm.title' />
          </div>

          {accounts.map((item, i) => this.renderRPCSelectorMenuItem(item, i))}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default LoginLocal
