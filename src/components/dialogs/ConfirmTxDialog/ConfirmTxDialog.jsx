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
import { modalsClear, modalsClose } from '@chronobank/core/redux/modals/actions'
import { ETH } from '@chronobank/core/dao/constants'
import TxEntryModel from '@chronobank/core/models/TxEntryModel'
import { LogTxModel } from '@chronobank/core/models'

import './ConfirmTxDialog.scss'
import Value from '../../common/Value/Value'
import IPFSHash from './IPFSHash/IPFSHash'

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
    description: PropTypes.instanceOf(LogTxModel),
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
    const { entry, description } = this.props

    const tx = entry.tx
    const gasFee = tx.gasPrice ? tx.gasPrice.mul(tx.gasLimit) : null

    return (
      <ModalDialog hideCloseIcon title={<Translate value={description.title} />}>
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='paramsList'>

              {description.fields && description.fields.map((field, i) => {
                if (field.type === "ipfsHash") {
                  return <IPFSHash key={i} multihash={field.value} langPath={description.path} />
                }

                return (
                  <div styleName='param' key={i}>
                    <div styleName='label'>
                      <Translate value={field.description} />
                    </div>
                    <div styleName='value'>
                      <Value value={field.value} />
                    </div>
                  </div>
                )
              })}

              {gasFee && (
                <div styleName='param'>
                  <div styleName='label'>
                    <Translate value='tx.fee' />
                  </div>
                  <div styleName='value'>
                    <TokenValue value={new Amount(gasFee, ETH)} />
                  </div>
                </div>
              )}
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
