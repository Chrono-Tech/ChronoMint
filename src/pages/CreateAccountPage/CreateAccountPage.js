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

import { Button } from 'components'
import { setNewAccountCredentials } from '@chronobank/login/redux/network/actions'
import validate from './validate'

import styles from 'layouts/Splash/styles'
import fieldStyles from './styles'
import './CreateAccountPage.scss'

export const FORM_CREATE_ACCOUNT = 'CreateAccountForm'

function mapStateToProps (state, ownProps) {

  return {
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onSubmit: (values) => {
      const walletName = values.get('walletName')
      const password = values.get('password')

      dispatch(setNewAccountCredentials(walletName, password))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_CREATE_ACCOUNT, validate })
export default class CreateAccountPage extends PureComponent {
  render () {
    const { handleSubmit, pristine, valid, initialValues } = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form' name={FORM_CREATE_ACCOUNT} onSubmit={handleSubmit}>
          <div styleName='create-title'>
            Create New Account
          </div>

          <div styleName='create-title-description'>
            Created wallet will be encrypted using given password and stored in your
            browser&apos;s local storage.
          </div>

          <div styleName='fields-block'>
            <Field
              component={TextField}
              name='walletName'
              floatingLabelText='Wallet name'
              fullWidth
              {...styles.textField}
              {...fieldStyles.textField}
            />
            <Field
              component={TextField}
              name='password'
              type='password'
              floatingLabelText='Password'
              fullWidth
              {...styles.textField}
              {...fieldStyles.textField}
            />
            <Field
              component={TextField}
              name='confirmPassword'
              type='password'
              floatingLabelText='Confirm Password'
              fullWidth
              {...styles.textField}
              {...fieldStyles.textField}
            />
          </div>

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
            >
              Create new account
            </Button>
            or<br />
            <Link to='/' href styleName='link'>Use an existing account</Link>
          </div>

        </form>

      </MuiThemeProvider>
    )
  }
}
