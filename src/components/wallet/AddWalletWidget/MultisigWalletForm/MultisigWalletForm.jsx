/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import OwnersList from 'components/wallet/OwnersList/OwnersList'
import SignaturesList from 'components/wallet/SignaturesList/SignaturesList'
import Button from 'components/common/ui/Button/Button'
import { createWallet } from '@chronobank/core/redux/multisigWallet/actions'
import MultisigWalletModel from '@chronobank/core/models/wallet/MultisigWalletModel'
import { TextField } from 'redux-form-material-ui'
import OwnerCollection from '@chronobank/core/models/wallet/OwnerCollection'
import OwnerModel from '@chronobank/core/models/wallet/OwnerModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { change, Field, FieldArray, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { goToWallets, resetWalletsForm } from '@chronobank/core/redux/mainWallet/actions'
import { DUCK_SESSION } from '@chronobank/core/redux/session/actions'
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
    changeSignatures: (count) => dispatch(change(FORM_MULTISIG_WALLET_ADD, 'requiredSignatures', count)),
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

      const wallet = new MultisigWalletModel({
        ...props.initialValues.toJS(),
        ...values.toJS(),
        releaseTime,
        owners: ownersCollection,
        address: uuid(),
      })

      dispatch(createWallet(wallet))
      dispatch(goToWallets())
      dispatch(resetWalletsForm())
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_MULTISIG_WALLET_ADD, validate })
export default class MultisigWalletForm extends PureComponent {
  static propTypes = {
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
    if (owners.length < this.props.requiredSignatures) {
      this.props.changeSignatures(owners.length)
    }
  }

  render () {
    const { pristine, valid, ownersCount } = this.props

    return (
      <form styleName='root' onSubmit={this.props.handleSubmit}>
        <div styleName='body'>
          <div styleName='block name'>
            <Field
              component={TextField}
              name='name'
              fullWidth
              floatingLabelText={<Translate value={`${prefix}.name`} />}
            />
          </div>
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
        </div>
      </form>
    )
  }
}

