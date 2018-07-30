/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from '@material-ui/core'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  getAccountName,
  // getAccountAvatar,
  getAccountAvatarImg,
  getAccountAddress,
} from '@chronobank/core/redux/persistAccount/utils'
import styles from 'layouts/Splash/styles'
import {
  initRecoverAccountPage,
} from '@chronobank/login/redux/network/thunks'
import Button from 'components/common/ui/Button/Button'
import UserRow from 'components/common/ui/UserRow/UserRow'
import {
  FORM_RECOVER_ACCOUNT,
  navigateToSelectWallet,
} from '../../redux/actions'
import {
  onSubmitRecoverAccountForm,
  onSubmitRecoverAccountFormSuccess,
  onSubmitRecoverAccountFormFail,
} from '../../redux/thunks'
import './RecoverAccount.scss'

function mapStateToProps (state) {
  const selectedWallet = state.get('persistAccount').selectedWallet
  return {
    selectedWallet: selectedWallet && new AccountEntryModel(selectedWallet),
  }
}

function mapDispatchToProps (dispatch,) {
  return {
    onSubmit: async (values) => {
      let words = [], mnemonic = ''

      for (let i = 1; i <= 12; i++) {
        const word = values.get(`word-${i}`)
        word && words.push(word)
      }

      mnemonic = words.join(' ')

      await dispatch(onSubmitRecoverAccountForm(mnemonic))
    },
    onSubmitSuccess: () => dispatch(onSubmitRecoverAccountFormSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitRecoverAccountFormFail(errors, submitErrors)),
    initRecoverAccountPage: () => dispatch(initRecoverAccountPage()),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
  }
}

class RecoverAccountPage extends PureComponent {
  static propTypes = {
    selectedWallet: PropTypes.instanceOf(AccountEntryModel),
    initRecoverAccountPage: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
  }

  componentWillMount () {
    this.props.initRecoverAccountPage()
  }

  render () {
    const { handleSubmit, selectedWallet, navigateToSelectWallet, error } = this.props

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
          <Link to='/login' href styleName='link'>
            <Translate value='RecoverAccount.back' />
          </Link>
        </div>

      </form>
    )
  }
}

const form = reduxForm({ form: FORM_RECOVER_ACCOUNT })(RecoverAccountPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)
