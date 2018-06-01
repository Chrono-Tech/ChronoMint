/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { UserRow, Button } from 'components'

import styles from 'layouts/Splash/styles'
import './ResetPasswordPage.scss'

const FORM_LOGIN_PAGE = 'FormLoginPage'

@reduxForm({ form: FORM_LOGIN_PAGE })
export default class ResetPasswordPage extends PureComponent {
  render () {
    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form'>

          <div styleName='page-title'>Reset password</div>

          <div styleName='user-row'>
            <UserRow
              title='1Q1pE5vPGEEMqRcVRMbtBK842Y6Pzo6nK9'
              avatar={'/src/assets/img/profile-photo-1.jpg'}
              onClick={() => {}}
            />

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
                name='confirm-password'
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
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}
