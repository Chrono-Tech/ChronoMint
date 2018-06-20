/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider, CircularProgress } from 'material-ui'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { UserRow, Button } from 'components'
import {
  onSubmitLoginForm,
  onSubmitLoginFormFail,
  initLoginPage,
  navigateToSelectWallet,
} from '@chronobank/login/redux/network/actions'
import AutomaticProviderSelector from '@chronobank/login-ui/components/ProviderSelectorSwitcher/AutomaticProviderSelector'
import ManualProviderSelector from '@chronobank/login-ui/components/ProviderSelectorSwitcher/ManualProviderSelector'

import styles from 'layouts/Splash/styles'
import './LoginPage.scss'

const STRATEGY_MANUAL = 'manual'
const STRATEGY_AUTOMATIC = 'automatic'

const nextStrategy = {
  [STRATEGY_AUTOMATIC]: STRATEGY_MANUAL,
  [STRATEGY_MANUAL]: STRATEGY_AUTOMATIC,
}

export const FORM_LOGIN_PAGE = 'FormLoginPage'

function mapStateToProps (state, ownProps) {

  return {
    selectedWallet: state.get('persistWallet').selectedWallet,
    isLoginSubmitting: state.get('network').isLoginSubmitting,
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onSubmit: async (values) => {
      const password = values.get('password')

      await dispatch(onSubmitLoginForm(password))
    },
    onSubmitFail: () => dispatch(onSubmitLoginFormFail()),
    initLoginPage: () => dispatch(initLoginPage()),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
  }
}

class LoginPage extends PureComponent {
  static propTypes = {
    initLoginPage: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
    isLoginSubmitting: PropTypes.bool,
  }

  constructor(props){
    super(props)

    this.state = {
      isShowProvider: true,
      strategy: STRATEGY_AUTOMATIC,
    }
  }

  componentWillMount(){
    this.props.initLoginPage()
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
    const { handleSubmit, pristine, valid, initialValues, isImportMode, onSubmit, selectedWallet,
      navigateToSelectWallet, isLoginSubmitting } = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form' name={FORM_LOGIN_PAGE} onSubmit={handleSubmit}>

          <div styleName='page-title'>Log In</div>

          <div styleName='selector'>
            { this.renderProviderSelector() }
          </div>

          <div styleName='user-row'>
            <UserRow
              title={selectedWallet && selectedWallet.name}
              avatar={'/src/assets/img/profile-photo-1.jpg'}
              onClick={navigateToSelectWallet}
            />

            <div styleName='field'>
              <Field
                component={TextField}
                name='password'
                type='password'
                floatingLabelText='Enter Password'
                fullWidth
                {...styles.textField}
              />
            </div>

            <div styleName='actions'>
              <Button
                styleName='button'
                buttonType='login'
                type='submit'
                label={isLoginSubmitting
                  ? <CircularProgress
                    style={{ verticalAlign: 'middle', marginTop: -2 }}
                    size={24}
                    thickness={1.5}
                  /> : 'Log In'}
                disabled={isLoginSubmitting}
              />

              <Link to='/' href styleName='link'>Forgot you password?</Link>
            </div>
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_LOGIN_PAGE })(LoginPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)
