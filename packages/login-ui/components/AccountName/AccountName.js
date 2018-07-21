/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'

import {
  onSubmitAccountName,
  onSubmitAccountNameSuccess,
  onSubmitAccountNameFail,
  initAccountNamePage,
  FORM_LOGIN_PAGE,
} from '@chronobank/login/redux/network/actions'
import validate from './validate'

import styles from 'layouts/Splash/styles'
import spinner from 'assets/img/spinningwheel-1.gif'
import './AccountName.scss'

function mapStateToProps (state) {
  const selectedWallet = state.get('persistAccount').selectedWallet

  return {
    selectedWallet: selectedWallet,
    isLoginSubmitting: state.get('network').isLoginSubmitting,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: async (values) => {
      const accountName = values.get('accountName')

      await dispatch(onSubmitAccountName(accountName))
    },
    onSubmitSuccess: () => dispatch(onSubmitAccountNameSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitAccountNameFail(errors, dispatch, submitErrors)),
    initAccountNamePage: () => dispatch(initAccountNamePage()),
  }
}

class LoginPage extends PureComponent {
  static propTypes = {
    initAccountNamePage: PropTypes.func,
    isLoginSubmitting: PropTypes.bool,
  }

  componentWillMount(){
    this.props.initAccountNamePage()
  }

  render () {
    const { handleSubmit, error, isLoginSubmitting } = this.props

    return (
        <form styleName='form' name={FORM_LOGIN_PAGE} onSubmit={handleSubmit}>

          <div styleName='page-title'>
            <Translate value='AccountName.title' />
          </div>

          <p styleName='description'>
            <Translate value='AccountName.description' />
            <br />
            <Translate value='AccountName.descriptionExtra' />
          </p>

          <div styleName='content'>

            <div styleName='field'>
              <Field
                component={TextField}
                name='accountName'
                floatingLabelText={<Translate value='AccountName.accountNamePlaceholder' />}
                fullWidth
                {...styles.textField}
              />
            </div>

            <div styleName='actions'>
              <Button
                styleName='button'
                buttonType='login'
                type='submit'
                label={isLoginSubmitting
                  ? <span styleName='spinner-wrapper'>
                    <img
                      src={spinner}
                      alt=''
                      width={24}
                      height={24}
                    />
                  </span> : <Translate value='AccountName.submit' />}
                disabled={isLoginSubmitting}
              />

              { error ? (<div styleName='form-error'>{error}</div>) : null }

              <Translate value='AccountName.or' />
              <br />
              <Link to='/login/upload-wallet' href styleName='link'>
                <Translate value='AccountName.back' />
              </Link>
            </div>
          </div>

        </form>
    )
  }
}

const form = reduxForm({ form: FORM_LOGIN_PAGE, validate })(LoginPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)
