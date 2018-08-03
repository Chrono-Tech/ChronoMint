/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form/immutable'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import {
  getAccountName,
  getAccountAvatarImg,
  getAccountAddress,
} from '@chronobank/core/redux/persistAccount/utils'
import styles from 'layouts/Splash/styles'
import Button from 'components/common/ui/Button/Button'
import UserRow from 'components/common/ui/UserRow/UserRow'
import {
  FORM_RECOVER_ACCOUNT,
} from '../../redux/constants'
import './RecoverAccount.scss'

class RecoverAccount extends PureComponent {
  static propTypes = {
    selectedWallet: PropTypes.object,
    navigateToSelectWallet: PropTypes.func,
    previousPage: PropTypes.func,
  }

  render () {
    const { handleSubmit, error, selectedWallet, navigateToSelectWallet, previousPage } = this.props

    const wordsArray = new Array(12).fill()

    return (
      <form styleName='form' name={FORM_RECOVER_ACCOUNT} onSubmit={handleSubmit}>
        <div styleName='title'>
          <Translate value='RecoverAccount.title' />
        </div>

        <div styleName='user-row'>
          <UserRow
            title={getAccountName(selectedWallet)}
            avatar={getAccountAvatarImg(selectedWallet)}
            subtitle={getAccountAddress(selectedWallet, true)}
            onClick={navigateToSelectWallet}
          />
        </div>

        <div styleName='fields-block'>
          {
            wordsArray.map((item, i) => (
              <Field
                key={i}
                styleName='field'
                component={TextField}
                name={`word-${i + 1}`}
                label={<div><Translate value='RecoverAccount.word' />&nbsp;{ i + 1 }</div>}
                fullWidth
                {...styles.textField}
              />
            ))
          }
        </div>

        <div styleName='actions'>
          <Button
            styleName='button'
            buttonType='login'
            type='submit'
          >
            <Translate value='RecoverAccount.resetPassword' />
          </Button>
          { error && (<div styleName='form-error'>{error}</div>) }
          <Translate value='RecoverAccount.or' />
          <br />
          <button onClick={previousPage} styleName='link'>
            <Translate value='RecoverAccount.back' />
          </button>
        </div>

      </form>
    )
  }
}

export default reduxForm({ form: FORM_RECOVER_ACCOUNT })(RecoverAccount)
