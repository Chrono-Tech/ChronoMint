/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { UserRow, Button } from 'components'

import styles from 'layouts/Splash/styles'
import './ResetPasswordPage.scss'

const FORM_LOGIN_PAGE = 'MnemonicLoginPageForm'

@reduxForm({ form: FORM_LOGIN_PAGE })
export default class MnemonicLoginPage extends PureComponent {
  render () {
    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form'>

          <div styleName='page-title'>Mnemonic form</div>

          <div styleName='field'>
            <Field
              component={TextField}
              name='mnemonic'
              type='text'
              floatingLabelText='Mnemonic'
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
              Login
            </Button>
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}
