/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form/immutable'
import { Link } from 'react-router'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import styles from 'layouts/Splash/styles'
import { Button } from 'components'
import {
  onSubmitMnemonicLoginForm,
  onSubmitMnemonicLoginFormSuccess,
  onSubmitMnemonicLoginFormFail,
} from '@chronobank/login/redux/network/actions'

import './LoginWithMnemonic.scss'

export const FORM_MNEMONIC_LOGIN_PAGE = 'FormMnemonicLoginPage'

const multiRowTextFieldStyle = {
  textareaStyle: {
    background: 'rgba(0,0,0,.2)',
    borderRadius: 3,
    color: '#FFB54E',
    padding: 8,
    fontWeight: 700,
    height: 62,
    margin: 0,
  },
  underlineFocusStyle:{
    border: 'none',
  },
  underlineStyle: {
    border: 'none',
  },
  hintStyle: {
    margin: 'auto',
    textAlign: 'center',
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#A3A3CC',
  },
}

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

class LoginWithMnemonic extends PureComponent {
  render () {
    const { handleSubmit } = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form' name={FORM_MNEMONIC_LOGIN_PAGE} onSubmit={handleSubmit}>

          <div styleName='page-title'>
            <Translate value='LoginWithMnemonic.title' />
          </div>

          <div styleName='description'>
            <Translate value='LoginWithMnemonic.description' />
          </div>

          <div styleName='field'>
            <Field
              component={TextField}
              name='mnemonic'
              type='text'
              hintText={<Translate value='LoginWithMnemonic.mnemonic' />}
              fullWidth
              multiLine
              rows={2}
              rowsMax={2}
              {...styles.textField}
              {...multiRowTextFieldStyle}
            />
          </div>

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
            >
              <Translate value='LoginWithMnemonic.login' />
            </Button>
            <Translate value='LoginWithMnemonic.or' />
            &nbsp;
            <Link to='/login/import-methods' href styleName='link'>
              <Translate value='LoginWithMnemonic.back' />
            </Link>
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_MNEMONIC_LOGIN_PAGE })(LoginWithMnemonic)
export default connect(null, mapDispatchToProps)(form)
