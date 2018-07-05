/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import UserRow from 'components/common/ui/UserRow/UserRow'

import {
  onSubmitLoginForm,
  onSubmitLoginFormFail,
  initLoginPage,
  navigateToSelectWallet,
  initAccountsSignature,
  DUCK_NETWORK,
  FORM_LOGIN_PAGE,
} from '@chronobank/login/redux/network/actions'
import {
  getAccountName,
  getAccountAvatar,
} from '@chronobank/core/redux/persistAccount/utils'

import styles from 'layouts/Splash/styles'
import spinner from 'assets/img/spinningwheel-1.gif'
import './NetworkCreateModal.scss'

function mapStateToProps (state) {
  return {

    }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: async (values) => {
      const password = values.get('password')

      await dispatch(onSubmitLoginForm(password))
    },
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitLoginFormFail(errors, dispatch, submitErrors)),
  }
}

class LoginPage extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func,
  }

  render () {
    const { handleSubmit, pristine, valid, initialValues, isImportMode, error, onSubmit} = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form' name={'FORM_NETWORK_CREATE'} onSubmit={handleSubmit}>

          <div styleName='title'>
            Please, enter network url
          </div>

          <div styleName='field'>
            <Field
              component={TextField}
              name='url'
              type='text'
              floatingLabelText={<Translate value='LoginForm.Url' />}
              fullWidth
              {...styles.textField}
            />
          </div>

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
              label={<Translate value='LoginForm.submitButton' />}
            />

            { error ? (<div styleName='form-error'>{error}</div>) : null }
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_LOGIN_PAGE })(LoginPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)
