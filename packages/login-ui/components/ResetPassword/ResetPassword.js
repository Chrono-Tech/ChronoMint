/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  getAccountName,
  getAccountAddress,
  getAccountAvatarImg,
} from '@chronobank/core/redux/persistAccount/utils'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import Button from 'components/common/ui/Button/Button'
import UserRow from 'components/common/ui/UserRow/UserRow'
import styles from 'layouts/Splash/styles'
import {
  FORM_RESET_PASSWORD,
} from '../../redux/constants'
import validate from './validate'
import './ResetPassword.scss'

class ResetPassword extends PureComponent {
  static propTypes = {
    selectedWallet: PropTypes.instanceOf(AccountEntryModel),
  }

  render () {
    const { handleSubmit, selectedWallet } = this.props

    return (
      <form styleName='form' name={FORM_RESET_PASSWORD} onSubmit={handleSubmit}>

        <div styleName='page-title'>
          <Translate value='ResetPassword.title' />
        </div>

        <div styleName='user-row'>
          <UserRow
            title={getAccountName(selectedWallet)}
            avatar={getAccountAvatarImg(selectedWallet)}
            subtitle={getAccountAddress(selectedWallet, true)}
          />
        </div>

        <div styleName='field'>
          <Field
            component={TextField}
            name='password'
            type='password'
            label={<Translate value='ResetPassword.password' />}
            fullWidth
            {...styles.textField}
          />
          <Field
            component={TextField}
            name='confirmPassword'
            type='password'
            label={<Translate value='ResetPassword.confirmPassword' />}
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
            <Translate value='ResetPassword.reset' />
          </Button>
        </div>

      </form>
    )
  }
}

export default reduxForm({ form: FORM_RESET_PASSWORD, validate })(ResetPassword)
