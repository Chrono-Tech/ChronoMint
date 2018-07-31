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
  getAccountAddress,
  getAccountAvatarImg,
} from '@chronobank/core/redux/persistAccount/utils'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import Button from 'components/common/ui/Button/Button'
import UserRow from 'components/common/ui/UserRow/UserRow'
import styles from 'layouts/Splash/styles'
import {
  onSubmitResetAccountPasswordForm,
} from '@chronobank/login/redux/network/thunks'
import {
  FORM_RESET_PASSWORD,
} from '../../redux/actions'
import {
  onSubmitResetAccountPasswordSuccess,
  onSubmitResetAccountPasswordFail,
  initResetPasswordPage,
} from '../../redux/thunks'
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
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitResetAccountPasswordFail(errors, submitErrors)),
    initResetPasswordPage: () => dispatch(initResetPasswordPage()),
  }
}

class ResetPasswordPage extends PureComponent {
  static propTypes = {
    selectedWallet: PropTypes.instanceOf(AccountEntryModel),
    initResetPasswordPage: PropTypes.func,
  }

  render () {
    const { handleSubmit, selectedWallet } = this.props

    return (
      <form styleName='form' name={FORM_RESET_PASSWORD} onSubmit={handleSubmit}>

        <div styleName='page-title'>
          <Translate value='ResetPassword.title' />
        </div>

        <div styleName='user-row'>
          <UserRow
            title={getAccountName(selectedWallet)}
            avatar={getAccountAvatarImg(selectedWallet)}
            subtitle={getAccountAddress(selectedWallet, true)}
          />
        </div>

        <div styleName='field'>
          <Field
            component={TextField}
            name='password'
            type='password'
            label={<Translate value='ResetPassword.password' />}
            fullWidth
            {...styles.textField}
          />
          <Field
            component={TextField}
            name='confirmPassword'
            type='password'
            label={<Translate value='ResetPassword.confirmPassword' />}
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
    )
  }
}

const form = reduxForm({ form: FORM_RESET_PASSWORD, validate })(ResetPasswordPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)
