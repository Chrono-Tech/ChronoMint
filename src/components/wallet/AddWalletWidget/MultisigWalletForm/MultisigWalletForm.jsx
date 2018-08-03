/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import OwnersList from 'components/wallet/OwnersList/OwnersList'
import SignaturesList from 'components/wallet/SignaturesList/SignaturesList'
import Button from 'components/common/ui/Button/Button'
import { TextField } from 'redux-form-material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { change, Field, FieldArray, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_SESSION } from '@chronobank/core/redux/session/actions'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'
import { FORM_MULTISIG_WALLET_ADD } from 'components/constants'
import { prefix } from './lang'
import validate from './validate'
import './MultisigWalletForm.scss'

function mapStateToProps (state, ownProps) {
  const selector = formValueSelector(FORM_MULTISIG_WALLET_ADD)
  let owners = selector(state, 'owners')
  const wallet = ownProps.wallet || new MultisigEthWalletModel()

  return {
    initialValues: wallet.toAddFormJS(),
    isTimeLocked: selector(state, 'isTimeLocked'),
    requiredSignatures: selector(state, 'requiredSignatures'),
    is2FA: selector(state, 'is2FA'),
    ownersCount: owners ? owners.size + 1 : 1,
    account: state.get(DUCK_SESSION).account,
    profile: state.get(DUCK_SESSION).profile,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    changeSignatures: (count) => dispatch(change(FORM_MULTISIG_WALLET_ADD, 'requiredSignatures', count)),
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
    requiredSignatures: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    createWallet: PropTypes.func,
    wallet: PropTypes.instanceOf(MultisigEthWalletModel),
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
              label={<Translate value={`${prefix}.name`} />}
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

