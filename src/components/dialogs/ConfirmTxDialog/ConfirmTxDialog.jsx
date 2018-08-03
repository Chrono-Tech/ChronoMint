/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokenValue from 'components/common/TokenValue/TokenValue'
import Value from 'components/common/Value/Value'
import ModalDialog from 'components/dialogs/ModalDialog'
import Amount from '@chronobank/core/models/Amount'
import classnames from 'classnames'
import Button from 'components/common/ui/Button/Button'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { modalsClear, modalsClose } from 'redux/modals/actions'
import { WATCHER_TX_SET } from '@chronobank/core/redux/watcher/constants'
import Preloader from 'components/common/Preloader/Preloader'
import TokenPrice from 'components/common/TokenPrice/TokenPrice'
import { getDataForConfirm } from '@chronobank/core/redux/transactions/selectors/selectors'
import TxExecModel from '../../../../packages/core/models/TxExecModel'

import './ConfirmTxDialog.scss'

const makeMapStateToProps = (state, ownProps) => {
  const { tx } = ownProps
  const getData = getDataForConfirm(tx)
  return (ownState) => {
    return ({
      ...getData(ownState),
    })
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    modalsClear: () => dispatch(modalsClear()),
    modalsClose: () => dispatch(modalsClose()),
    handleUpdateTx: (tx) => dispatch({ type: WATCHER_TX_SET, tx }),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class ConfirmTxDialog extends PureComponent {
  static propTypes = {
    amountBalanceAfter: PropTypes.instanceOf(Amount),
    feeBalanceAfter: PropTypes.instanceOf(Amount),
    mainSymbol: PropTypes.string,
    confirm: PropTypes.func.isRequired,
    reject: PropTypes.func.isRequired,
    handleReject: PropTypes.func,
    modalsClear: PropTypes.func.isRequired,
    modalsClose: PropTypes.func.isRequired,
    tx: PropTypes.instanceOf(TxExecModel),
    feeMultiplier: PropTypes.number,
  }

  handleConfirm = () => {
    this.props.modalsClear()
    this.props.confirm(this.props.tx)
  }

  handleClose = () => {
    this.props.modalsClear()
    this.props.reject(this.props.tx)
  }

  getKeyValueRows (fields) {
    const getValue = ([key, field]) => {

      const fieldValue = field.value
      let value = <Value value={fieldValue} />

      if (fieldValue === null || fieldValue === undefined) return
      // parse value
      switch (fieldValue.constructor.name) {
        case 'Amount':
        case 'BigNumber':
          value = <Value value={fieldValue} />
          break
        case 'Object':
          if (React.isValidElement(fieldValue)) {
            value = fieldValue
          } else if (fieldValue.isFetching && fieldValue.isFetching()) {
            value = <Preloader />
          } else {
            return this.getKeyValueRows(fieldValue)
          }
          break
      }

      return (
        <div styleName='param' key={key}>
          <div styleName='label'>
            <Translate value={`${this.props.tx.langPrefix}${field.description}`} />
          </div>
          <div styleName={classnames('value', { 'big': key === 'value' })}>
            {value}
          </div>
        </div>
      )
    }
    return Object.entries(fields).map(([key, field]) => {

      if (key === 'value' || key === 'amount') {//TODO @Abdulov remove checking value
        return (
          <div styleName='param' key={key}>
            <div styleName='value big'>
              <Value value={field.value} params={{ noRenderPrice: true }} />
            </div>
            <div styleName='price'>USD <TokenPrice value={field.value} isRemoveDecimals /></div>
          </div>
        )
      } else {
        return getValue([key, field])
      }

    })
  }

  render () {
    const { tx, amountBalanceAfter, feeBalanceAfter, fields, mainSymbol } = this.props

    return (
      <ModalDialog hideCloseIcon title={<Translate value={tx.funcTitle()} />}>
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='paramsList'>

              {this.getKeyValueRows(fields, tx.i18nFunc())}

              <div styleName='param'>
                <div styleName='label'>
                  <Translate value='tx.fee' />
                </div>
                <div styleName='value'>
                  <TokenValue value={tx.fee.gasFee} />
                </div>
              </div>
              {mainSymbol !== tx.symbol && amountBalanceAfter && (
                <div styleName='param'>
                  <div styleName='label'>
                    <Translate value='tx.balanceAfter' symbol={tx.symbol} />
                  </div>
                  <div styleName='value'>
                    <TokenValue value={amountBalanceAfter} />
                  </div>
                </div>
              )}
              <div styleName='param'>
                <div styleName='label'>
                  <Translate value='tx.balanceAfter' symbol={mainSymbol} />
                </div>
                <div styleName='value'>
                  <TokenValue value={feeBalanceAfter} />
                </div>
              </div>
            </div>

            {feeBalanceAfter.lt(0) && (
              <div styleName='error'>
                <Translate value='tx.notEnough' symbol={mainSymbol} />
              </div>
            )}

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
              disabled={(amountBalanceAfter !== null && amountBalanceAfter.lt(0)) || feeBalanceAfter.lt(0)}
              onClick={this.handleConfirm}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
