/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider } from '@material-ui/core'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'

import Button from 'components/common/ui/Button/Button'
import {
  onSubmitCreateAccountPage,
  onSubmitCreateAccountPageSuccess,
  onSubmitCreateAccountPageFail,
  FORM_CREATE_ACCOUNT,
} from '@chronobank/login/redux/network/actions'
import styles from 'layouts/Splash/styles'

import validate from './validate'

import fieldStyles from './styles'
import './CreateAccount.scss'

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
      <MuiThemeProvider>
        <form styleName='form' name={FORM_CREATE_ACCOUNT} onSubmit={handleSubmit}>
          <div styleName='create-title'>
            <Translate value='CreateAccount.title' />
          </div>

          <div styleName='create-title-description'>
            <Translate value='CreateAccount.description' />
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
              <Translate value='CreateAccount.login' />
            </Button>
            {error && (<div styleName='form-error'>{error}</div>)}
            <Translate value='CreateAccount.or' />
            <br />
            <Link to='/login/select-account' href styleName='link'>
              <Translate value='CreateAccount.useAccount' />
            </Link>
          </div>

        </form>

      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_CREATE_ACCOUNT, validate })(CreateAccountPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)

