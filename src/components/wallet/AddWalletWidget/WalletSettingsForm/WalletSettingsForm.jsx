/**
 * Copyright 2017–2019, LaborX PTY
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
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import { setWalletName } from '@chronobank/core/redux/wallets/actions'
import { FORM_WALLET_SETTINGS } from 'components/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import { BLOCKCHAIN_EOS } from '@chronobank/core/dao/constants'
import { setEOSWalletName } from '@chronobank/core/redux/eos/thunks'
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
      const { wallet } = ownProps
      switch (wallet.blockchain) {
        case BLOCKCHAIN_EOS:
          dispatch(setEOSWalletName(wallet.id, name))
          break
        default:
          // TODO refactor this after wallet refactoring
          if (wallet.isMain) {
            dispatch(setWalletName(wallet.id, name))
          } else {
            dispatch(setMultisigWalletName(wallet.id, name))
          }
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
    wallet: PropTypes.oneOfType([PTWallet || PropTypes.instanceOf(WalletModel)]).isRequired,
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
                label={<Translate value={`${prefix}.name`} />}
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
