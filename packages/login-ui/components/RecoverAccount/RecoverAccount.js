/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  onSubmitRecoverAccountForm,
  onSubmitRecoverAccountFormSuccess,
  onSubmitRecoverAccountFormFail,
  initRecoverAccountPage,
} from '@chronobank/login/redux/network/actions'

import { Button, UserRow } from 'components'

import styles from 'layouts/Splash/styles'
import './RecoverAccount.scss'

export const FORM_RECOVER_ACCOUNT = 'RecoverAccountPage'

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
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitRecoverAccountFormFail(errors, dispatch, submitErrors)),
    initRecoverAccountPage: () => dispatch(initRecoverAccountPage()),
  }
}

class RecoverAccountPage extends PureComponent {
  static propTypes = {
    selectedWallet: PropTypes.instanceOf(AccountEntryModel),
    initRecoverAccountPage: PropTypes.func,
  }

  componentWillMount(){
    this.props.initRecoverAccountPage()
  }

  get getSelectedWalletName(){
    const { selectedWallet } = this.props
    return selectedWallet && selectedWallet.name || ''
  }

  render () {
    const { handleSubmit, selectedWallet } = this.props

    const wordsArray = new Array(12).fill()

    return (
      <MuiThemeProvider>
        <form styleName='form' name={FORM_RECOVER_ACCOUNT} onSubmit={handleSubmit}>
          <div styleName='title'>
            Enter mnemonic to reset password
          </div>

          <div styleName='user-row'>
            <UserRow
              title={this.getSelectedWalletName}
              avatar={'/src/assets/img/profile-photo-1.jpg'}
              hideActionIcon
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
                  floatingLabelText={`Word ${i + 1}`}
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
              Reset password
            </Button>
            or<br />
            <Link to='/login' href styleName='link'>Back</Link>
          </div>

        </form>

      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_RECOVER_ACCOUNT })(RecoverAccountPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)
