/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button, ModalDialog } from 'components'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { confirm2FATransfer } from 'redux/multisigWallet/actions'
import PropTypes from 'prop-types'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import MultisigWalletPendingTxModel from 'models/wallet/MultisigWalletPendingTxModel'
import { prefix } from './lang'
import './TwoFaConfirmModal.scss'
import validate from './validate'

export const FORM_2FA_CONFIRM = 'Form2FAConfirm'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (values, dispatch, props) => {
      dispatch(confirm2FATransfer(props.tx, values.get('confirmToken'), (res) => {
        // eslint-disable-next-line
        console.log('res', res)
      }))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_2FA_CONFIRM, validate })
export default class TwoFaConfirmModal extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    tx: PropTypes.instanceOf(MultisigWalletPendingTxModel),
    ...formPropTypes,
  }

  render () {
    return (
      <ModalDialog title={<Translate value={`${prefix}.title`} />}>
        <form styleName='root' onSubmit={this.props.handleSubmit}>
          <div styleName='body'>
            <div styleName='description'><Translate value={`${prefix}.description`} /></div>
            <div styleName='field'>
              <Field
                component={TextField}
                name='confirmToken'
                floatingLabelText={<Translate value={`${prefix}.authCode`} />}
              />
            </div>
          </div>
          <div styleName='actions'>
            <Button
              type='submit'
              label={<Translate value={`${prefix}.confirm`} />}
            />
          </div>
        </form>
      </ModalDialog>
    )
  }
}
