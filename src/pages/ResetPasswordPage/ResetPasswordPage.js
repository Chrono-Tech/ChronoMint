/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  WalletEntryModel,
} from 'models/persistWallet'
import {
  onSubmitResetAccountPasswordForm,
  onSubmitResetAccountPasswordSuccess,
  onSubmitResetAccountPasswordFail,
  initResetPasswordPage,
} from '@chronobank/login/redux/network/actions'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { UserRow, Button } from 'components'

import styles from 'layouts/Splash/styles'
import validate from './validate'
import './ResetPasswordPage.scss'

export const FORM_RESET_PASSWORD = 'ResetPasswordPage'

function mapStateToProps (state, ownProps) {
  const selectedWallet = state.get('persistWallet').selectedWallet
  return {
    selectedWallet: new WalletEntryModel({...selectedWallet}),
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onSubmit: async (values) => {
      const password = values.get('password')

      await dispatch(onSubmitResetAccountPasswordForm(password))
    },
    onSubmitSuccess: () => dispatch(onSubmitResetAccountPasswordSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitResetAccountPasswordFail(errors, dispatch, submitErrors)),
    initResetPasswordPage: () => dispatch(initResetPasswordPage()),
  }
}

class ResetPasswordPage extends PureComponent {
  static propTypes = {
    selectedWallet: PropTypes.instanceOf(WalletEntryModel),
    initResetPasswordPage: PropTypes.func,
  }

  componentWillMount(){
    this.props.initResetPasswordPage()
  }

  get getSelectedWalletName(){
    const { selectedWallet } = this.props
    return selectedWallet && selectedWallet.name || ''
  }
  render () {
    const { handleSubmit, selectedWallet } = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form' name={FORM_RESET_PASSWORD} onSubmit={handleSubmit}>

          <div styleName='page-title'>Reset password</div>

          <div styleName='user-row'>
            <UserRow
              title={this.getSelectedWalletName}
              avatar={'/src/assets/img/profile-photo-1.jpg'}
              onClick={() => {}}
            />
          </div>

          <div styleName='field'>
            <Field
              component={TextField}
              name='password'
              type='password'
              floatingLabelText='Enter New Password'
              fullWidth
              {...styles.textField}
            />
            <Field
              component={TextField}
              name='confirmPassword'
              type='password'
              floatingLabelText='Confirm New Password'
              fullWidth
              {...styles.textField}
            />
          </div>

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
            >
              Reset
            </Button>
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_RESET_PASSWORD, validate })(ResetPasswordPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)
