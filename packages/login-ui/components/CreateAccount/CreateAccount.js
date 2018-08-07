/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import AccountProfileModel from '@chronobank/core/models/wallet/persistAccount/AccountProfileModel'
import UserRow from '../UserRow/UserRow'
import {
  FORM_CREATE_ACCOUNT,
} from '../../redux/constants'
import validate from './validate'
import './CreateAccount.scss'

class CreateAccount extends PureComponent {
  static propTypes = {
    navigateToSelectWallet: PropTypes.func,
    accountProfile: PropTypes.instanceOf(AccountProfileModel),
  }

  renderAccountNameField () {
    const { accountProfile } = this.props

    return accountProfile ? (
      <div>
        <UserRow
          title={accountProfile.userName}
          avatar={accountProfile.avatar}
          subtitle={accountProfile.address}
        />
      </div>
    ) : null
  }

  render () {
    const { handleSubmit, error, navigateToSelectWallet, accountProfile } = this.props

    return (
      <form styleName='form' name={FORM_CREATE_ACCOUNT} onSubmit={handleSubmit}>
        <div styleName='create-title'>
          <Translate value='CreateAccount.title' />
        </div>

        <div styleName='create-title-description'>
          <Translate value='CreateAccount.description' />
        </div>

        <div styleName='fields-block'>
          { this.renderAccountNameField() }

          <Field
            component={TextField}
            styleName={classnames({
              'hidden-field': accountProfile,
            })}
            name='walletName'
            label={<Translate value='CreateAccount.walletName' />}
            fullWidth
          />
          <Field
            component={TextField}
            name='password'
            type='password'
            label={<Translate value='CreateAccount.password' />}
            fullWidth
          />
          <Field
            component={TextField}
            name='confirmPassword'
            type='password'
            label={<Translate value='CreateAccount.confirmPassword' />}
            fullWidth
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
          <button onClick={navigateToSelectWallet} styleName='link'>
            <Translate value='CreateAccount.useAccount' />
          </button>
        </div>

      </form>

    )
  }
}

export default reduxForm({ form: FORM_CREATE_ACCOUNT, validate })(CreateAccount)

