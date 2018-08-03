/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokenValue from 'components/common/TokenValue/TokenValue'
import ModalDialog from 'components/dialogs/ModalDialog'
import Amount from '@chronobank/core/models/Amount'
import Button from 'components/common/ui/Button/Button'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { modalsClear, modalsClose } from 'redux/modals/actions'
import { ETH } from '@chronobank/core/redux/mainWallet/actions'
import TxEntryModel from '@chronobank/core/models/TxEntryModel'

import './ConfirmTxDialog.scss'

function mapDispatchToProps (dispatch, props) {
  return {
    modalsClear: () => dispatch(modalsClear()),
    modalsClose: () => dispatch(modalsClose()),
    handleAccept: (entry) => dispatch(props.accept(entry)),
    handleReject: (entry) => dispatch(props.reject(entry)),
  }
}

@connect(null, mapDispatchToProps)
export default class ConfirmTxDialog extends PureComponent {
  static propTypes = {
    accept: PropTypes.func.isRequired,
    reject: PropTypes.func.isRequired,
    handleAccept: PropTypes.func,
    handleReject: PropTypes.func,
    modalsClear: PropTypes.func.isRequired,
    modalsClose: PropTypes.func.isRequired,
    entry: PropTypes.instanceOf(TxEntryModel),
    feeMultiplier: PropTypes.number,
  }

  handleConfirm = () => {
    this.props.modalsClear()
    this.props.handleAccept(this.props.entry)
  }

  handleClose = () => {
    this.props.modalsClear()
    this.props.handleReject(this.props.entry)
  }

  render () {
    const { entry } = this.props

    const tx = entry.tx
    const gasFee = tx.gasPrice.mul(tx.gasLimit)

    return (
      <ModalDialog hideCloseIcon title={<Translate value='tx.confirm' />}>
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='paramsList'>

              <div styleName='param'>
                <div styleName='label'>
                  <Translate value='tx.from' />
                </div>
                <div styleName='value'>
                  {tx.from}
                </div>
              </div>

              <div styleName='param'>
                <div styleName='label'>
                  <Translate value='tx.to' />
                </div>
                <div styleName='value'>
                  {tx.to}
                </div>
              </div>

              <div styleName='param'>
                <div styleName='label'>
                  <Translate value='tx.fee' />
                </div>
                <div styleName='value'>
                  <TokenValue value={new Amount(gasFee, ETH)} />
                </div>
              </div>
            </div>

          </div>
          <div styleName='footer'>
            <Button
              flat
              styleName='action'
              label={<Translate value='terms.cancel' />}
              onClick={this.handleClose}
            />
            <Button
              styleName='action'
              label={<Translate value='terms.confirm' />}
              onClick={this.handleConfirm}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
