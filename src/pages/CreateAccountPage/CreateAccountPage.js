/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'

import { Button } from 'components'
import { onSubmitCreateAccountPage } from '@chronobank/login/redux/network/actions'
import AutomaticProviderSelector from '@chronobank/login-ui/components/ProviderSelectorSwitcher/AutomaticProviderSelector'
import ManualProviderSelector from '@chronobank/login-ui/components/ProviderSelectorSwitcher/ManualProviderSelector'
import web3Provider from '@chronobank/login/network/Web3Provider'

import validate from './validate'

import styles from 'layouts/Splash/styles'
import fieldStyles from './styles'
import './CreateAccountPage.scss'

const STRATEGY_MANUAL = 'manual'
const STRATEGY_AUTOMATIC = 'automatic'

const nextStrategy = {
  [STRATEGY_AUTOMATIC]: STRATEGY_MANUAL,
  [STRATEGY_MANUAL]: STRATEGY_AUTOMATIC,
}

export const FORM_CREATE_ACCOUNT = 'CreateAccountForm'

function mapStateToProps (state, ownProps) {

  return {
    isImportMode: state.get('network').importAccountMode,
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onSubmit: (values) => {
      const walletName = values.get('walletName')
      const password = values.get('password')

      dispatch(onSubmitCreateAccountPage(walletName, password))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_CREATE_ACCOUNT, validate })
export default class CreateAccountPage extends PureComponent {
  static propTypes = {
    isImportMode: PropTypes.bool,
  }

  constructor(){
    super()

    this.state = {
      isShowProvider: true,
      strategy: STRATEGY_AUTOMATIC,
    }
  }

  handleToggleProvider = (isShowProvider) => this.setState({ isShowProvider })

  handleSelectorSwitch = (currentStrategy) => this.setState({ strategy: nextStrategy[currentStrategy] })

  renderProviderSelector () {
    switch (this.state.strategy) {
      case STRATEGY_MANUAL:
        return this.renderManualProviderSelector()
      case STRATEGY_AUTOMATIC:
        return this.renderAutomaticProviderSelector()
      default:
        return null
    }
  }

  renderAutomaticProviderSelector () {
    return (
      <AutomaticProviderSelector
        currentStrategy={this.state.strategy}
        onSelectorSwitch={this.handleSelectorSwitch}
      />
    )
  }

  renderManualProviderSelector () {
    return (
      <ManualProviderSelector
        show={this.state.isShowProvider}
        currentStrategy={this.state.strategy}
        onSelectorSwitch={this.handleSelectorSwitch}
      />
    )
  }

  render () {
    const { handleSubmit, pristine, valid, initialValues, isImportMode } = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form' name={FORM_CREATE_ACCOUNT} onSubmit={handleSubmit}>
          <div styleName='create-title'>
            Create New Account
          </div>

          <div styleName='create-title-description'>
            Created wallet will be encrypted using given password and stored in your
            browser&apos;s local storage.
          </div>

          { this.renderProviderSelector() }

          <div styleName='fields-block'>
            <Field
              component={TextField}
              name='walletName'
              floatingLabelText='Wallet name'
              fullWidth
              {...styles.textField}
              {...fieldStyles.textField}
            />
            <Field
              component={TextField}
              name='password'
              type='password'
              floatingLabelText='Password'
              fullWidth
              {...styles.textField}
              {...fieldStyles.textField}
            />
            <Field
              component={TextField}
              name='confirmPassword'
              type='password'
              floatingLabelText='Confirm Password'
              fullWidth
              {...styles.textField}
              {...fieldStyles.textField}
            />
          </div>

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
            >
              Create new account
            </Button>
            or<br />
            <Link to='/' href styleName='link'>Use an existing account</Link>
          </div>

        </form>

      </MuiThemeProvider>
    )
  }
}
