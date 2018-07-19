/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form/immutable'
import { Link } from 'react-router'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import styles from 'layouts/Splash/styles'
import Button from 'components/common/ui/Button/Button'
import {
  onSubmitMnemonicLoginForm,
  onSubmitMnemonicLoginFormSuccess,
  onSubmitMnemonicLoginFormFail,
  FORM_MNEMONIC_LOGIN_PAGE,
} from '@chronobank/login/redux/network/actions'

import validate from './validate'
import './LoginWithMnemonic.scss'

const multiRowTextFieldStyle = {
  textareaStyle: {
    background: 'rgba(0,0,0,.2)',
    borderRadius: 3,
    color: '#FFB54E',
    padding: 8,
    fontWeight: 700,
    minHeight: 62,
    margin: 0,
  },
  underlineFocusStyle: {
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
  inputStyle: {
    height: 'auto',
  },
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (values) => {
      const confirmMnemonic = values.get('mnemonic')
      dispatch(onSubmitMnemonicLoginForm(confirmMnemonic))
    },
    onSubmitSuccess: () => dispatch(onSubmitMnemonicLoginFormSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitMnemonicLoginFormFail(errors, dispatch, submitErrors)),
  }
}

class LoginWithMnemonic extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
  }

  render () {
    const { handleSubmit, error } = this.props

    return (
      <MuiThemeProvider>
        <form styleName='form' name={FORM_MNEMONIC_LOGIN_PAGE} onSubmit={handleSubmit}>

          <div styleName='page-title'>
            <Translate value='LoginWithMnemonic.title' />
          </div>

          <div styleName='field'>
            <Field
              styleName='mnemonicField'
              component={TextField}
              name='mnemonic'
              type='text'
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
              <Translate value='LoginWithMnemonic.submit' />
            </Button>

            { error ? (<div styleName='form-error'>{error}</div>) : null }

            <Translate value='LoginWithMnemonic.or' />
            <br />
            <Link to='/login/import-methods' href styleName='link'>
              <Translate value='LoginWithMnemonic.back' />
            </Link>
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_MNEMONIC_LOGIN_PAGE, validate })(LoginWithMnemonic)
export default connect(null, mapDispatchToProps)(form)
