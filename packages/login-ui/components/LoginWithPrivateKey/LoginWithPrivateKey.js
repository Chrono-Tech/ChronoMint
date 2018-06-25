/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import styles from 'layouts/Splash/styles'
import { Button } from 'components'
import {
  onSubmitPrivateKeyLoginForm,
  onSubmitPrivateKeyLoginFormSuccess,
  onSubmitPrivateKeyLoginFormFail,
} from '@chronobank/login/redux/network/actions'

import './LoginWithPrivateKey.scss'

export const FORM_PRIVATE_KEY_LOGIN_PAGE = 'FormPrivateKeyLoginPage'

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (values) => {
      const privateKey = values.get('pk')
      dispatch(onSubmitPrivateKeyLoginForm(privateKey))
    },
    onSubmitSuccess: () => dispatch(onSubmitPrivateKeyLoginFormSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitPrivateKeyLoginFormFail(errors, dispatch, submitErrors)),
  }
}

class MnemonicLoginPage extends PureComponent {
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
            or&nbsp;
            <Link to='/login/import-methods' href styleName='link'>back</Link>
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_PRIVATE_KEY_LOGIN_PAGE })(MnemonicLoginPage)
export default connect(null, mapDispatchToProps)(form)
