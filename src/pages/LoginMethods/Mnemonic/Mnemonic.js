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
  onSubmitMnemonicLoginForm,
  onSubmitMnemonicLoginFormSuccess,
  onSubmitMnemonicLoginFormFail,
} from '@chronobank/login/redux/network/actions'

import './Mnemonic.scss'

export const FORM_MNEMONIC_LOGIN_PAGE = 'MnemonicLoginPageForm'

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (values) => {
      const confirmMnemonic = values.get('mnemonic')
      dispatch(onSubmitMnemonicLoginForm(confirmMnemonic))
    },
    onSubmitSuccess: () => dispatch(onSubmitMnemonicLoginFormSuccess()),
    onSubmitFail: () => dispatch(onSubmitMnemonicLoginFormFail()),
  }
}

@connect(null, mapDispatchToProps)
@reduxForm({ form: FORM_MNEMONIC_LOGIN_PAGE })
export default class MnemonicLoginPage extends PureComponent {
  render () {
    const { handleSubmit } = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form' name={FORM_MNEMONIC_LOGIN_PAGE} onSubmit={handleSubmit}>

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
