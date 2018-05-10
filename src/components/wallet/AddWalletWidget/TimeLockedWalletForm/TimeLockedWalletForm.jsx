/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import Button from 'components/common/ui/Button/Button'
import { createWallet } from 'redux/multisigWallet/actions'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import OwnerCollection from 'models/wallet/OwnerCollection'
import OwnerModel from 'models/wallet/OwnerModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { change, Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
import { goToWallets } from 'redux/mainWallet/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { DatePicker, TimePicker } from 'redux-form-material-ui'
import { prefix } from './lang'
import './TimeLockedWalletForm.scss'

export const FORM_TIME_LOCKED_WALLET_ADD = 'TimeLockedWalletForm'

function mapStateToProps (state, ownProps) {
  const selector = formValueSelector(FORM_TIME_LOCKED_WALLET_ADD)
  let owners = selector(state, 'owners')
  const wallet = ownProps.wallet || new MultisigWalletModel()

  return {
    initialValues: wallet.toAddFormJS(),
    requiredSignatures: +selector(state, 'requiredSignatures'),
    is2FA: selector(state, 'is2FA'),
    ownersCount: owners ? owners.size + 1 : 1,
    account: state.get(DUCK_SESSION).account,
    profile: state.get(DUCK_SESSION).profile,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    changeSignatures: (count) => dispatch(change(FORM_TIME_LOCKED_WALLET_ADD, 'requiredSignatures', count)),
    onSubmit: (values, dispatch, props) => {
      // owners
      const owners = values.get('owners')
      let ownersCollection = new OwnerCollection()
      ownersCollection = ownersCollection.add(new OwnerModel({
        address: props.account,
      }))
      owners.forEach(({ address }) => {
        ownersCollection = ownersCollection.add(new OwnerModel({ address }))
      })

      // date
      let releaseTime = new Date(0)
      const date = values.get('timeLockDate')
      const time = values.get('timeLockTime')
      if (date && time) {
        releaseTime = new Date(date.setHours(
          time.getHours(),
          time.getMinutes(),
          time.getSeconds(),
          time.getMilliseconds(),
        ))
      }

      const wallet = new MultisigWalletModel({
        ...props.initialValues.toJS(),
        ...values.toJS(),
        releaseTime,
        owners: ownersCollection,
      })

      dispatch(createWallet(wallet))
      dispatch(goToWallets())
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_TIME_LOCKED_WALLET_ADD })
export default class TimeLockedWalletForm extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    isTimeLocked: PropTypes.bool,
    is2FA: PropTypes.bool,
    ownersCount: PropTypes.number,
    changeSignatures: PropTypes.func,
    requiredSignatures: PropTypes.number,
    ...formPropTypes,
  }

  handleChangeOwner = (owners) => {
    console.log('--WalletAddForm#handleChangeOwner', owners.length, this.props.requiredSignatures)
    if (owners.length < this.props.requiredSignatures) {
      this.props.changeSignatures(owners.length)
    }
  }

  render () {
    const { handleSubmit, pristine, valid } = this.props

    return (
      <form styleName='root' onSubmit={handleSubmit}>
        <div styleName='body'>
          {/*<div styleName='block'>*/}
          {/*<Field*/}
          {/*component={TextField}*/}
          {/*name='name'*/}
          {/*fullWidth*/}
          {/*floatingLabelText={<Translate value={`${prefix}.name`} />}*/}
          {/*/>*/}
          {/*</div>*/}
          <div styleName='block'>
            <Translate styleName='title' value={`${prefix}.title`} />
            <Translate styleName='description' value={`${prefix}.description`} />
            <div styleName='row timeLock'>
              <div styleName='col'>
                <Field
                  component={DatePicker}
                  name='timeLockDate'
                  floatingLabelText={<Translate value={`${prefix}.date`} />}
                  fullWidth
                />
              </div>
              <div styleName='col'>
                <Field
                  component={TimePicker}
                  name='timeLockTime'
                  floatingLabelText={<Translate value={`${prefix}.time`} />}
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
