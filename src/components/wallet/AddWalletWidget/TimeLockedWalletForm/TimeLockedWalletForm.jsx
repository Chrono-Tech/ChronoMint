/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import { TextField } from 'redux-form-material-ui'
import DatePicker from 'components/common/DatePicker'
import TimePicker from 'components/common/TimePicker'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { change, Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_SESSION } from '@chronobank/core/redux/session/actions'
import { FORM_TIME_LOCKED_WALLET_ADD } from 'components/constants'
import { prefix } from './lang'
import './TimeLockedWalletForm.scss'

function mapStateToProps (state, ownProps) {
  const selector = formValueSelector(FORM_TIME_LOCKED_WALLET_ADD)
  let owners = selector(state, 'owners')
  const wallet = ownProps.wallet || new MultisigEthWalletModel()

  return {
    initialValues: wallet.toAddFormJS(),
    requiredSignatures: selector(state, 'requiredSignatures'),
    is2FA: selector(state, 'is2FA'),
    ownersCount: owners ? owners.size + 1 : 1,
    account: state.get(DUCK_SESSION).account,
    profile: state.get(DUCK_SESSION).profile,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    changeSignatures: (count) => dispatch(change(FORM_TIME_LOCKED_WALLET_ADD, 'requiredSignatures', count)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_TIME_LOCKED_WALLET_ADD })
export default class TimeLockedWalletForm extends PureComponent {
  static propTypes = {
    isTimeLocked: PropTypes.bool,
    is2FA: PropTypes.bool,
    ownersCount: PropTypes.number,
    changeSignatures: PropTypes.func,
    requiredSignatures: PropTypes.string,
    ...formPropTypes,
  }

  render () {
    const { handleSubmit, pristine, valid } = this.props

    return (
      <form styleName='root' onSubmit={handleSubmit}>
        <div styleName='body'>
          <div styleName='block name'>
            <Field
              component={TextField}
              name='name'
              fullWidth
              label={<Translate value={`${prefix}.name`} />}
            />
          </div>
          <div styleName='block'>
            <Translate styleName='title' value={`${prefix}.title`} />
            <Translate styleName='description' value={`${prefix}.description`} />
            <div styleName='row timeLock'>
              <div styleName='col'>
                <Field
                  component={DatePicker}
                  name='timeLockDate'
                  label={<Translate value={`${prefix}.date`} />}
                  fullWidth
                />
              </div>
              <div styleName='col'>
                <Field
                  component={TimePicker}
                  name='timeLockTime'
                  label={<Translate value={`${prefix}.time`} />}
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>
        <div styleName='actions'>
          <Button
            styleName='action'
            label={<Translate value={`${prefix}.addWallet`} />}
            type='submit'
            disabled={pristine || !valid}
          />
        </div>
      </form>
    )
  }
}
