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
import ModalDialog from 'components/dialogs/ModalDialog'
import { setMultisigWalletName } from '@chronobank/core/redux/multisigWallet/actions'
import { modalsClose } from 'redux/modals/actions'
import { WALLET_SET_NAME } from '@chronobank/core/redux/mainWallet/actions'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import { FORM_WALLET_SETTINGS } from 'components/constants'
import { prefix } from './lang'
import './WalletSettingsForm.scss'

function mapStateToProps (state, ownProps) {
  return {
    initialValues: {
      name: ownProps.wallet.name,
    },
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onSubmit: (values: Map) => {
      const name = values.get('name')
      const { wallet, blockchain, address } = ownProps
      if (wallet.isMain) {
        dispatch({ type: WALLET_SET_NAME, blockchain, address, name })
      } else {
        dispatch(setMultisigWalletName(address, name))
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
    wallet: PTWallet.isRequired,
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
