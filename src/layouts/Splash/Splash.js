/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'

import { Button } from 'components'

import WalletTitleBG from 'assets/img/wallet-title-bg.png'
import StripesToCrop from 'assets/img/stripes-2-crop.jpg'
import ChronoWalletLogoBright from 'assets/img/chronowalletlogobright.svg'
import ChronoWalletTextBright from 'assets/img/chronowallettextbright.svg'

import Footer from '../Footer/Footer'

import './Splash.scss'
import styles from './styles'

export const FORM_CREATE_ACCOUNT = 'CreateAccountForm'

function mapStateToProps (state, ownProps) {

  return {
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onSubmit: (values) => {

    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_CREATE_ACCOUNT })
export default class Splash extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render () {
    const { handleSubmit, pristine, valid, initialValues } = this.props

    return (
      <form name={FORM_CREATE_ACCOUNT} onSubmit={handleSubmit} styleName='root'>
        <div styleName='header-container'>
          <div styleName='header-picture'>
            <img src={StripesToCrop} alt='' />
          </div>
          <div styleName='header-picture-crop'>
            <img src={WalletTitleBG} alt='' />
          </div>
          <div styleName='header-logos'>
            <img styleName='chrono-wallet-logo-bright' src={ChronoWalletLogoBright} alt='' />
            <img styleName='chrono-wallet-text-bright' src={ChronoWalletTextBright} alt='' />
          </div>
        </div>
        <div styleName='content'>
          <div styleName='create-title'>
            Create New Account
          </div>

          <div styleName='create-title-description'>
            Created wallet will be encrypted using given password and stored in your <br />
            browser&apos;s local storage.
          </div>

          <div styleName='fields-block'>
            <Field
              component={TextField}
              name='walletName'
              floatingLabelText='Wallet name'
              fullWidth
              {...styles.textField}
            />
            <Field
              component={TextField}
              name='password'
              type='password'
              floatingLabelText='Password'
              fullWidth
              {...styles.textField}
            />
            <Field
              component={TextField}
              name='confirmPassword'
              type='password'
              floatingLabelText='Confirm Password'
              fullWidth
              {...styles.textField}
            />
          </div>

          <div styleName='actions'>
            <Button styleName='button' type='submit' onTouchTap={this.handleWithdrawDeposit}>
              Create new account
            </Button>
            or<br />
            <Link to='/' href styleName='link'>Use an existing account</Link>
          </div>

        </div>

        {!window.isMobile && (<Footer />)}
      </form>
    )
  }
}

