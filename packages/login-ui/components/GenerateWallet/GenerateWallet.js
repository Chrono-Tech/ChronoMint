/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import classnames from 'classnames'
import { MuiThemeProvider } from 'material-ui'
import { reduxForm, Field } from 'redux-form/immutable'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button } from 'components'
import {
  downloadWallet,
} from '@chronobank/core/redux/persistAccount/actions'
import {
  navigateToLoginPage,
} from '@chronobank/login/redux/network/actions'

import Wallet from 'assets/img/icons/wallet-white.svg'

import './GenerateWallet.scss'

function mapDispatchToProps (dispatch) {
  return {
    downloadWallet: () => dispatch(downloadWallet()),
    navigateToLoginPage: () => dispatch(navigateToLoginPage()),
  }
}

@connect(null, mapDispatchToProps)
export default class MnemonicPage extends Component {
  static propTypes = {
    downloadWallet: PropTypes.func,
    navigateToLoginPage: PropTypes.func,
  }

  render () {
    const { downloadWallet, navigateToLoginPage } = this.props

    return (
      <MuiThemeProvider>
        <div styleName='wrapper'>
          <div>
            <div styleName='page-title'>Download a Wallet File</div>

            <p styleName='description'>
              You can use this wallet file in password recovery option to
              make your account available in another browser, for example.
              The file is protected by the same password as your created before.
            </p>

            <div styleName='actions'>
              <Button
                styleName='button'
                onClick={downloadWallet}
              >
                <img src={Wallet} alt='' />
                <br />
                Download
              </Button>

              <Button
                styleName='submit'
                buttonType='login'
                onClick={navigateToLoginPage}
              >
                Finish
              </Button>
            </div>

            <div styleName='progress-block'>
              <div styleName='progress-point' />
              <div styleName='progress-point' />
              <div styleName='progress-point' />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
