/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'

import { Button, UserRow } from 'components'

import styles from 'layouts/Splash/styles'
import './RecoverAccountPage.scss'

export const FORM_RECOVER_ACCOUNT_PAGE = 'RecoverAccountPage'

@reduxForm({ form: FORM_RECOVER_ACCOUNT_PAGE })
export default class CreateAccountPage extends PureComponent {
  render () {
    const { handleSubmit} = this.props

    const wordsArray = new Array(12).fill()

    return (
      <MuiThemeProvider>
        <form styleName='form' name={FORM_RECOVER_ACCOUNT_PAGE} onSubmit={handleSubmit}>
          <div styleName='title'>
            Enter mnemonic to reset password
          </div>

          <div styleName='user-row'>
            <UserRow
              title='1Q1pE5vPGEEMqRcVRMbtBK842Y6Pzo6nK9'
              onClick={() => {}}
            />
          </div>

          <div styleName='fields-block'>
            {
              wordsArray.map((item, i) => (
                <Field
                  key={i}
                  styleName='field'
                  component={TextField}
                  name={`word-${i + 1}`}
                  floatingLabelText={`Word ${i + 1}`}
                  fullWidth
                  {...styles.textField}
                />
              ))
            }
          </div>

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
            >
              Reset password
            </Button>
            or<br />
            <Link to='/' href styleName='link'>Back</Link>
          </div>

        </form>

      </MuiThemeProvider>
    )
  }
}
