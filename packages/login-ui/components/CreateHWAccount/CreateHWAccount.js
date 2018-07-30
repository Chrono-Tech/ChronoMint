/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import styles from 'layouts/Splash/styles'
import Button from 'components/common/ui/Button/Button'
import {
  onSubmitCreateHWAccountPage,
  onSubmitCreateHWAccountPageSuccess,
  onSubmitCreateHWAccountPageFail,
} from '../../redux/thunks'

import validate from './validate'

import fieldStyles from './styles'
import './CreateHWAccount.scss'

export const FORM_CREATE_HW_ACCOUNT = 'CreateAccountForm'

function mapStateToProps (state) {

  return {
    isImportMode: state.get('network').importAccountMode,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: async (values) => {
      const walletName = values.get('walletName')

      await dispatch(onSubmitCreateHWAccountPage(walletName))
    },
    onSubmitSuccess: () => dispatch(onSubmitCreateHWAccountPageSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitCreateHWAccountPageFail(errors, submitErrors)),
  }
}

class CreateHWAccountPage extends PureComponent {
  static propTypes = {
    isImportMode: PropTypes.bool,
  }

  render () {
    const { handleSubmit, pristine, valid, initialValues, error, isImportMode } = this.props

    return (
      <form styleName='form' name={FORM_CREATE_HW_ACCOUNT} onSubmit={handleSubmit}>
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
            label={<Translate value='CreateAccount.walletName' />}
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
          { error && (<div styleName='form-error'>{error}</div>) }
          <Translate value='CreateAccount.or' />
          <br />
          <Link to='/login/select-account' href styleName='link'>
            <Translate value='CreateAccount.useAccount' />
          </Link>
        </div>

      </form>
    )
  }
}

const form = reduxForm({ form: FORM_CREATE_HW_ACCOUNT, validate })(CreateHWAccountPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)

