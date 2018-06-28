/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'

import { Button } from 'components'
import {
  onSubmitCreateAccountPage,
  onSubmitCreateAccountPageSuccess,
  onSubmitCreateAccountPageFail,
} from '@chronobank/login/redux/network/actions'
import AutomaticProviderSelector from '@chronobank/login-ui/components/ProviderSelectorSwitcher/AutomaticProviderSelector'
import ManualProviderSelector from '@chronobank/login-ui/components/ProviderSelectorSwitcher/ManualProviderSelector'
import styles from 'layouts/Splash/styles'

import validate from './validate'

import fieldStyles from './styles'
import './CreateAccount.scss'

export const FORM_CREATE_ACCOUNT = 'CreateAccountForm'

function mapStateToProps (state) {

  return {
    isImportMode: state.get('network').importAccountMode,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: async (values) => {
      const walletName = values.get('walletName')
      const password = values.get('password')

      await dispatch(onSubmitCreateAccountPage(walletName, password))
    },
    onSubmitSuccess: () => dispatch(onSubmitCreateAccountPageSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitCreateAccountPageFail(errors, dispatch, submitErrors)),
  }
}

class CreateAccountPage extends PureComponent {
  static propTypes = {
    isImportMode: PropTypes.bool,
  }

  render () {
    const { handleSubmit, pristine, valid, initialValues, error, isImportMode } = this.props

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
              floatingLabelText={<Translate value='CreateAccount.walletName' />}
              fullWidth
              {...styles.textField}
              {...fieldStyles.textField}
            />
            <Field
              component={TextField}
              name='password'
              type='password'
              floatingLabelText={<Translate value='CreateAccount.password' />}
              fullWidth
              {...styles.textField}
              {...fieldStyles.textField}
            />
            <Field
              component={TextField}
              name='confirmPassword'
              type='password'
              floatingLabelText={<Translate value='CreateAccount.confirmPassword' />}
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
            { error && (<div styleName='form-error'>{error}</div>) }
            or<br />
            <Link to='/login/select-account' href styleName='link'>Use an existing account</Link>
          </div>

        </form>

      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_CREATE_ACCOUNT, validate })(CreateAccountPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)
