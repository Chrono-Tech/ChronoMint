/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import styles from 'layouts/Splash/styles'
import { Button } from 'components'
import {
  onSubmitPrivateKeyLoginForm,
  onSubmitPrivateKeyLoginFormSuccess,
  onSubmitPrivateKeyLoginFormFail,
} from '@chronobank/login/redux/network/actions'

import './PrivateKey.scss'

export const FORM_PRIVATE_KEY_LOGIN_PAGE = 'PrivateKeyLoginPageForm'

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (values) => dispatch(onSubmitPrivateKeyLoginForm(values)),
    onSubmitSuccess: () => dispatch(onSubmitPrivateKeyLoginFormSuccess()),
    onSubmitFail: () => dispatch(onSubmitPrivateKeyLoginFormFail()),
  }
}

@connect(null, mapDispatchToProps)
@reduxForm({ form: FORM_PRIVATE_KEY_LOGIN_PAGE })
export default class MnemonicLoginPage extends PureComponent {
  render () {
    const { handleSubmit } = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form' name={FORM_PRIVATE_KEY_LOGIN_PAGE} onSubmit={handleSubmit}>

          <div styleName='page-title'>Private key form</div>

          <div styleName='field'>
            <Field
              component={TextField}
              name='pk'
              type='text'
              floatingLabelText='Private key'
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
