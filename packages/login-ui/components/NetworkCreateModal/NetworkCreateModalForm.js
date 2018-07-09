/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import UserRow from 'components/common/ui/UserRow/UserRow'

import {
  onSubmitLoginForm,
  onSubmitLoginFormFail,
  initLoginPage,
  navigateToSelectWallet,
  initAccountsSignature,
  DUCK_NETWORK,
  FORM_LOGIN_PAGE,
} from '../../../login/redux/network/actions'
import {
  getAccountName,
  getAccountAvatar,
} from '../../../core/redux/persistAccount/utils'

import styles from 'layouts/Splash/styles'
import spinner from 'assets/img/spinningwheel-1.gif'
import './NetworkCreateModal.scss'

const textFieldStyles = {
  floatingLabelStyle: {
    color: '#A3A3CC',
    top: 28,
    left: 0,
    right: 0,
    margin: 'auto',
    textAlign: 'left',
    transformOrigin: 'center center',
  },
  style: {
    height: 62,
    marginBottom: 20,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (values) => {
      const url = values.get('url')
      const alias = values.get('alias')

      dispatch(onSubmitLoginForm({ url, alias }))
    },
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitLoginFormFail(errors, dispatch, submitErrors)),
  }
}

class NetworkCreateModalForm extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func,
  }

  render () {
    const { handleSubmit, pristine, valid, initialValues, isImportMode, error, onSubmit} = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form' name={'FORM_NETWORK_CREATE'} onSubmit={handleSubmit}>

          <Field
            component={TextField}
            name='url'
            type='text'
            floatingLabelText='IP address or domain name'
            fullWidth
            {...styles.textField}
            {...textFieldStyles}
          />

          <Field
            component={TextField}
            name='alias'
            type='text'
            floatingLabelText='Alias'
            fullWidth
            {...styles.textField}
            {...textFieldStyles}
          />

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='flat'
              label='Cancel'
            />
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
              label='ADD'
            />

            { error ? (<div styleName='form-error'>{error}</div>) : null }
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_LOGIN_PAGE })(NetworkCreateModalForm)
export default connect(null, mapDispatchToProps)(form)
