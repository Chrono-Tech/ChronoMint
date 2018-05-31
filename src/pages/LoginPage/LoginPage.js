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
import loginPageStyles from './styles'
import './LoginPage.scss'

const FORM_LOGIN_PAGE = 'FormLoginPage'

@reduxForm({ form: FORM_LOGIN_PAGE })
class LoginPage extends PureComponent {
  render () {
    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form'>

          <div styleName='page-title'>Log In</div>

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
                floatingLabelText='Enter Password'
                fullWidth
                {...styles.textField}
                {...loginPageStyles.textField}
              />
            </div>

            <div styleName='actions'>
              <Button
                styleName='button'
                buttonType='login'
                type='submit'
              >
                Log In
              </Button>

              <Link to='/' href styleName='link'>Forgot you password?</Link>
            </div>
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

export default LoginPage
