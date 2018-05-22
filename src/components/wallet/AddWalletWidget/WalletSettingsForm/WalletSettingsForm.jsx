/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import Button from 'components/common/ui/Button/Button'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import MainWalletModel from 'models/wallet/MainWalletModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import DerivedWalletModel from 'models/wallet/DerivedWalletModel'
import ModalDialog from 'components/dialogs/ModalDialog'
import { MULTISIG_UPDATE } from 'redux/multisigWallet/actions'
import { modalsClose } from 'redux/modals/actions'
import { WALLET_SET_NAME } from 'redux/mainWallet/actions'
import { prefix } from './lang'
import './WalletSettingsForm.scss'

export const FORM_WALLET_SETTINGS = 'WalletSettingsForm'

function mapStateToProps (state, ownProps) {
  const name = ownProps.wallet instanceof MainWalletModel ? ownProps.wallet.name(ownProps.blockchain, ownProps.address) : ownProps.wallet.name()
  return {
    initialValues: {
      name,
    },
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onSubmit: (values: Map) => {
      const name = values.get('name')
      const { wallet, blockchain, address } = ownProps
      if (wallet instanceof MainWalletModel) {
        dispatch({ type: WALLET_SET_NAME, blockchain, address, name })
      } else {
        dispatch({ type: MULTISIG_UPDATE, wallet: wallet.name(name) })
      }
      dispatch(modalsClose())
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_WALLET_SETTINGS })
export default class WalletSettingsForm extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    address: PropTypes.string,
    wallet: PropTypes.oneOfType([
      PropTypes.instanceOf(MainWalletModel),
      PropTypes.instanceOf(MultisigWalletModel),
      PropTypes.instanceOf(DerivedWalletModel),
    ]).isRequired,
    ...formPropTypes,
  }

  render () {
    const { handleSubmit } = this.props

    return (
      <ModalDialog title={<Translate value={`${prefix}.title`} />}>
        <form onSubmit={handleSubmit} styleName='root'>
          <div styleName='body'>
            <div styleName='block'>
              <Field
                component={TextField}
                name='name'
                fullWidth
                floatingLabelText={<Translate value={`${prefix}.name`} />}
              />
            </div>
          </div>
          <div styleName='actions'>
            <Button
              styleName='action'
              label={<Translate value={`${prefix}.setName`} />}
              type='submit'
            />
          </div>
        </form>
      </ModalDialog>
    )
  }
}
