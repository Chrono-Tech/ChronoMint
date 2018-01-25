import icnWalletDialogWhite from 'assets/img/icn-wallet-dialog-white.svg'
import OwnersList from 'components/wallet/OwnersList/OwnersList'
import SignaturesList from 'components/wallet/SignaturesList/SignaturesList'
import { RaisedButton } from 'material-ui'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import OwnerCollection from 'models/wallet/OwnerCollection'
import OwnerModel from 'models/wallet/OwnerModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DatePicker, TimePicker, Toggle } from 'redux-form-material-ui'
import { Field, FieldArray, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { prefix } from './lang'
import validate from './validate'
import './WalletAddForm.scss'

export const FORM_WALLET_ADD_EDIT_DIALOG = 'WalletAddEditForm'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_WALLET_ADD_EDIT_DIALOG)
  const owners = selector(state, 'owners')

  return {
    isTimeLocked: selector(state, 'isTimeLocked'),
    is2FA: selector(state, 'is2FA'),
    ownersCount: owners ? owners.size + 1 : 1,
    account: state.get(DUCK_SESSION).account,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
  }
}

const onSubmit = (values, dispatch, props) => {
  // owners
  const owners = values.get('owners')
  let ownersCollection = new OwnerCollection()
  ownersCollection = ownersCollection.add(new OwnerModel({
    address: props.account,
  }))
  owners.forEach((owner) => {
    ownersCollection = ownersCollection.add(new OwnerModel({
      address: owner.get('address'),
    }))
  })

  // date
  let releaseTime = new Date(0)
  const isTimeLocked = values.get('isTimeLocked')
  if (isTimeLocked) {
    const date = values.get('timeLockDate')
    const time = values.get('timeLockTime')
    releaseTime = date.setHours(
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    )
  }

  return new MultisigWalletModel({
    ...props.initialValues.toJS(),
    ...values.toJS(),
    releaseTime,
    owners: ownersCollection,
  })
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_WALLET_ADD_EDIT_DIALOG, validate, onSubmit })
export default class WalletAddEditForm extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    isTimeLocked: PropTypes.bool,
    is2FA: PropTypes.bool,
    ownersCount: PropTypes.number,
    ...formPropTypes,
  }

  render () {
    const { handleSubmit, pristine, valid, isTimeLocked, is2FA, ownersCount } = this.props

    return (
      <form styleName='root' onSubmit={handleSubmit}>
        <div styleName='header'>
          <img styleName='headerIcon' src={icnWalletDialogWhite} />
          <Translate styleName='headerTitle' value={`${prefix}.createNewWallet`} />
        </div>
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
            <Field
              component={Toggle}
              name='isTimeLocked'
              label={<Translate value={`${prefix}.timeLocked`} />}
              toggled={false}
            />
            <Translate styleName='description' value={`${prefix}.timeLockedDescription`} />
            {isTimeLocked && (
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
            )}
          </div>
          {false && (
            <div styleName='block'>
              <Field
                component={Toggle}
                name='is2FA'
                label={<Translate value={`${prefix}.twoFA`} />}
                toggled={false}
              />
              <Translate styleName='description' value={`${prefix}.twoFADescription`} />
            </div>
          )}
          <div styleName='block'>
            <Translate styleName='title' count={ownersCount} value={`${prefix}.walletOwners`} />
            {is2FA
              ? <Translate value={`${prefix}.walletOwners2FADescription`} />
              : <Translate styleName='description' value={`${prefix}.walletOwnersDescription`} />
            }
            {!is2FA && (
              <div styleName='ownersList'>
                <FieldArray
                  component={OwnersList}
                  name='owners'
                />
              </div>
            )}
          </div>
          {!is2FA && (
            <div styleName='block'>
              <Translate styleName='title' value={`${prefix}.requiredSignatures`} />
              <Translate styleName='description' value={`${prefix}.requiredSignaturesDescription`} />
              <div styleName='signaturesList'>
                <Field
                  component={SignaturesList}
                  name='requiredSignatures'
                  count={ownersCount}
                />
              </div>
            </div>
          )}
        </div>
        <div styleName='actions'>
          <RaisedButton
            styleName='action'
            label={<Translate value={`${prefix}.addWallet`} />}
            type='submit'
            primary
            disabled={pristine || !valid}
          />
        </div>
      </form>
    )
  }
}
