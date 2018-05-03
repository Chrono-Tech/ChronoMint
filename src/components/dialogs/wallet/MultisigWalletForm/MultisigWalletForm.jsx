/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import OwnersList from 'components/wallet/OwnersList/OwnersList'
import SignaturesList from 'components/wallet/SignaturesList/SignaturesList'
import Immutable from 'immutable'
import Button from 'components/common/ui/Button/Button'
import { createWallet } from 'redux/multisigWallet/actions'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import ipfs from 'utils/IPFS'
import OwnerCollection from 'models/wallet/OwnerCollection'
import OwnerModel from 'models/wallet/OwnerModel'
import PropTypes from 'prop-types'
import web3Converter from 'utils/Web3Converter'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { change, Field, FieldArray, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { prefix } from './lang'
import validate from './validate'
import './MultisigWalletForm.scss'

export const FORM_MULTISIG_WALLET_ADD = 'MultisigWalletForm'

function mapStateToProps (state, ownProps) {
  const selector = formValueSelector(FORM_MULTISIG_WALLET_ADD)
  let owners = selector(state, 'owners')
  const wallet = ownProps.wallet || new MultisigWalletModel()

  return {
    initialValues: wallet.toAddFormJS(),
    isTimeLocked: selector(state, 'isTimeLocked'),
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
    changeSignatures: (count) => dispatch(change(FORM_MULTISIG_WALLET_ADD, 'requiredSignatures', count)),
    createWallet: (wallet: MultisigWalletModel) => dispatch(createWallet(wallet)),
    updateUserProfile: (profile) => {
      ipfs.put(profile).then((data) => {
        // eslint-disable-next-line
        console.log('data', data)
        // eslint-disable-next-line
        console.log('web3Converter.ipfsHashToBytes32(data)', web3Converter.ipfsHashToBytes32(data))
      }, (error) => {
        // eslint-disable-next-line
        console.log('error', error)
      })
    },
  }
}

const onSubmit = (values, dispatch, props) => {
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
  const isTimeLocked = values.get('isTimeLocked')
  if (isTimeLocked) {
    const date = values.get('timeLockDate')
    const time = values.get('timeLockTime')
    releaseTime = new Date(date.setHours(
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds(),
    ))
  }

  return new MultisigWalletModel({
    ...props.initialValues.toJS(),
    ...values.toJS(),
    releaseTime,
    owners: ownersCollection,
  })
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_MULTISIG_WALLET_ADD, validate, onSubmit })
export default class MultisigWalletForm extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    isTimeLocked: PropTypes.bool,
    is2FA: PropTypes.bool,
    ownersCount: PropTypes.number,
    changeSignatures: PropTypes.func,
    requiredSignatures: PropTypes.number,
    createWallet: PropTypes.func,
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    ...formPropTypes,
  }

  handleChangeOwner = (owners) => {
    console.log('--WalletAddForm#handleChangeOwner', owners.length, this.props.requiredSignatures)
    if (owners.length < this.props.requiredSignatures) {
      this.props.changeSignatures(owners.length)
    }
  }

  handleUpdateUserProfile = () => {
    let profile = this.props.profile
    this.props.updateUserProfile(profile.toJS())
    let newProfile = profile.wallets(new Immutable.Map({ wallet: 'text' }))
    this.props.updateUserProfile(newProfile.toJS())
  }

  render () {
    const { handleSubmit, pristine, valid, isTimeLocked, is2FA, ownersCount } = this.props

    return (
      <div styleName='root'>
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
            <Translate styleName='title' count={ownersCount} value={`${prefix}.walletOwners`} />
            <Translate styleName='description' value={`${prefix}.walletOwnersDescription`} />
            <div styleName='ownersList'>
              <FieldArray
                component={OwnersList}
                onRemove={this.handleChangeOwner}
                name='owners'
              />
            </div>
          </div>
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
        </div>
        <div styleName='actions'>
          <Button
            styleName='action'
            label={<Translate value={`${prefix}.addWallet`} />}
            type='submit'
            disabled={pristine || !valid}
          />
          <Button
            styleName='action'
            label='save profile'
            onTouchTap={this.handleUpdateUserProfile}
          />
        </div>
      </div>
    )
  }
}

