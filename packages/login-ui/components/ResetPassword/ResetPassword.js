/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from '@material-ui/core'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  getAccountName,
  getAccountAvatar,
} from '@chronobank/core/redux/persistAccount/utils'
import {
  onSubmitResetAccountPasswordForm,
  onSubmitResetAccountPasswordSuccess,
  onSubmitResetAccountPasswordFail,
  initResetPasswordPage,
  FORM_RESET_PASSWORD,
} from '@chronobank/login/redux/network/actions'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import Button from 'components/common/ui/Button/Button'
import UserRow from 'components/common/ui/UserRow/UserRow'

import styles from 'layouts/Splash/styles'
import validate from './validate'
import './ResetPassword.scss'

function mapStateToProps (state) {
  const selectedWallet = state.get('persistAccount').selectedWallet
  return {
    selectedWallet: selectedWallet && new AccountEntryModel(selectedWallet),
  }
}

function mapDispatchToProps (dispatch) {
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
    selectedWallet: PropTypes.instanceOf(AccountEntryModel),
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
      <MuiThemeProvider >
        <form styleName='form' name={FORM_RESET_PASSWORD} onSubmit={handleSubmit}>

          <div styleName='page-title'>
            <Translate value='ResetPassword.title' />
          </div>

          <div styleName='user-row'>
            <UserRow
              title={getAccountName(selectedWallet)}
              avatar={getAccountAvatar(selectedWallet)}
              onClick={() => {}}
            />
          </div>

          <div styleName='field'>
            <Field
              component={TextField}
              name='password'
              type='password'
              floatingLabelText={<Translate value='ResetPassword.password' />}
              fullWidth
              {...styles.textField}
            />
            <Field
              component={TextField}
              name='confirmPassword'
              type='password'
              floatingLabelText={<Translate value='ResetPassword.confirmPassword' />}
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
              <Translate value='ResetPassword.reset' />
            </Button>
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_RESET_PASSWORD, validate })(ResetPasswordPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)
