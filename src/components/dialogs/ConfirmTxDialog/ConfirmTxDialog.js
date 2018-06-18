/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import TokenValue from 'components/common/TokenValue/TokenValue'
import BigNumber from 'bignumber.js'
import Value from 'components/common/Value/Value'
import ModalDialog from 'components/dialogs/ModalDialog'
import classnames from 'classnames'
import { CircularProgress, Table, TableBody, TableRow, TableRowColumn } from 'material-ui'
import Amount from 'models/Amount'
import Button from 'components/common/ui/Button/Button'
import TxExecModel from 'models/TxExecModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_MAIN_WALLET, ETH } from 'redux/mainWallet/actions'
import { modalsClear, modalsClose } from 'redux/modals/actions'
import { DUCK_WATCHER, WATCHER_TX_SET } from 'redux/watcher/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import GasSlider from 'components/common/GasSlider/GasSlider'
import Preloader from 'components/common/Preloader/Preloader'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'

import './ConfirmTxDialog.scss'

const mapStateToProps = (state, ownProps) => {
  return ({
    balance: state.get(DUCK_MAIN_WALLET).balances().item(ETH).amount(),
    tx: state.get(DUCK_WATCHER).confirmTx,
    gasPriceMultiplier: ownProps.localFeeMultiplier || state.get(DUCK_SESSION).gasPriceMultiplier.get(BLOCKCHAIN_ETHEREUM) || 1,
  })
}

function mapDispatchToProps (dispatch) {
  return {
    modalsClear: () => dispatch(modalsClear()),
    modalsClose: () => dispatch(modalsClose()),
    handleUpdateTx: (tx) => dispatch({ type: WATCHER_TX_SET, tx }),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ConfirmTxDialog extends PureComponent {
  static propTypes = {
    localFeeMultiplier: PropTypes.number,
    callback: PropTypes.func.isRequired,
    modalsClear: PropTypes.func.isRequired,
    modalsClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    tx: PropTypes.instanceOf(TxExecModel),
    balance: PropTypes.instanceOf(Amount),
    gasPriceMultiplier: PropTypes.number,
    handleUpdateTx: PropTypes.func,
    handleEstimateGas: PropTypes.func,
  }

  componentDidMount () {
    this.handleRepeatAction()
  }

  handleRepeatAction = () => {
    const additionalAction = this.props.tx.additionalAction()
    let tx = this.props.tx.additionalAction(additionalAction ? additionalAction.isFailed(false) : additionalAction)

    this.props.handleUpdateTx(tx)

    if (additionalAction) {
      additionalAction
        .action()
        .then((result) => {
          const newParams = tx.params().concat(Object.values(result.value() || []))
          const newTx = this.props.tx.params(newParams).additionalAction(result)

          this.props.handleUpdateTx(newTx)
          if (result.isFetched()) {
            this.props.handleEstimateGas(tx.funcName(), newTx.params(), tx.value(), this.props.gasPriceMultiplier)
          }
        })
    } else {
      this.props.handleEstimateGas(tx.funcName(), tx.params(), tx.value(), this.props.gasPriceMultiplier)
    }
  }

  handleConfirm = () => {
    this.props.modalsClear()
    this.props.callback(true, this.props.tx)
  }

  handleClose = () => {
    this.props.modalsClose()
    this.props.callback(false, this.props.tx)
  }

  handleChangeGasPrice = (gasPriceMultiplier) => {
    const { tx } = this.props
    this.props.handleUpdateTx(tx.setGas(new BigNumber(0)))
    this.props.handleEstimateGas(tx.funcName(), tx.params(), tx.value(), gasPriceMultiplier)
  }

  getActions () {
    return [
      <Button
        flat
        key='close'
        label={<Translate value='terms.cancel' />}
        onClick={this.handleClose}
      />,
      <Button
        flat
        key='confirm'
        label={<Translate value='terms.confirm' />}
        disabled={this.props.balance.lt(0)}
        onClick={this.handleConfirm}
      />,
    ]
  }

  getKeyValueRows (args, tokenBase) {
    return Object.keys(args).map((key) => {
      const arg = args[key]
      let value
      if (arg === null || arg === undefined) return
      // parse value
      switch (arg.constructor.name) {
        case 'Amount':
        case 'BigNumber':
          value = <Value value={arg} />
          break
        case 'Object':
          if (React.isValidElement(arg)) {
            value = arg
          } else if (arg.isFetching && arg.isFetching()) {
            value = <Preloader />
          } else {
            return this.getKeyValueRows(arg, tokenBase)
          }
          break
        default:
          value = <Value value={arg} />
      }

      return (
        <TableRow key={key}>
          <TableRowColumn style={{ width: '35%' }}>
            <Translate value={tokenBase + key} />
          </TableRowColumn>
          <TableRowColumn style={{ width: '65%', whiteSpace: 'normal' }}>
            {value}
          </TableRowColumn>
        </TableRow>
      )
    })
  }

  getKeyValueRowsNew (args, tokenBase) {
    return Object.keys(args).map((key) => {
      const arg = args[key]

      if (key === 'value') {
        return (
          <div styleName='param' key={key}>
            <div styleName={classnames('value', { 'big': key === 'value' })}>
              <Value value={arg} params={{ noRenderPrice: true }} />
            </div>
            <div styleName='price'>
              <TokenValue value={new Amount(arg, ETH)} renderOnlyPrice />
            </div>
          </div>
        )
      }

      let value
      if (arg === null || arg === undefined) return
      // parse value
      switch (arg.constructor.name) {
        case 'Amount':
        case 'BigNumber':
          value = <Value value={arg} />
          break
        case 'Object':
          if (React.isValidElement(arg)) {
            value = arg
          } else if (arg.isFetching && arg.isFetching()) {
            value = <Preloader />
          } else {
            return this.getKeyValueRows(arg, tokenBase)
          }
          break
        default:
          value = <Value value={arg} />
      }

      return (
        <div styleName='param' key={key}>
          <div styleName='label'>
            <Translate value={tokenBase + key} />
          </div>
          <div styleName={classnames('value', { 'big': key === 'value' })}>
            {value}
          </div>
        </div>
      )
    })
  }

  render () {
    const { tx, balance, gasPriceMultiplier } = this.props
    const txOptions = tx.options()
    let gasFee

    if (tx.isAdvancedFeeMode()) {
      gasFee = txOptions.advancedParams.gasFee
    } else {
      gasFee = tx.gas()
    }

    const balanceAfter = balance.minus(tx.value() || 0).minus(gasFee)
    const additionalAction = tx.additionalAction()
    const additionalActionIsFailed = additionalAction && additionalAction.isFailed()
    const additionalActionIsFetched = additionalAction ? additionalAction.isFetched() : true
    if (networkService.isMetaMask()) {
      this.handleConfirm()
    }
    return (
      <ModalDialog onModalClose={this.handleClose} title={<Translate value={tx.func()} />}>
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='paramsList'>
              {this.getKeyValueRowsNew(tx.args(), tx.i18nFunc())}

              {additionalAction && additionalAction.isFetched() && this.getKeyValueRows(additionalAction.value(), tx.i18nFunc())}

              <div styleName='param'>
                <div styleName='label'>
                  <Translate value='tx.fee' />
                </div>
                <div styleName='value'>
                  {gasFee.gt(0)
                    ? <TokenValue value={new Amount(gasFee, ETH)} />
                    : <Preloader size={16} thickness={1.5} />
                  }
                </div>
              </div>
              <div styleName='param'>
                <div styleName='label'>
                  <Translate value='tx.balanceAfter' />
                </div>
                <div styleName='value'>
                  {gasFee.gt(0)
                    ? <TokenValue value={new Amount(balanceAfter, ETH)} />
                    : <Preloader size={16} thickness={1.5} />
                  }
                </div>
              </div>
            </div>
            {balanceAfter.lt(0) && <div styleName='error'>Not enough ETH</div>}

            {additionalActionIsFailed && <div styleName='errorMessage'><Translate value={additionalAction.errorMessage()} /></div>}

            {!tx.isSkipSlider() &&
            <div styleName='gasSliderWrap'>
              <GasSlider
                isLocal
                disabled={additionalActionIsFailed || !additionalActionIsFetched}
                hideTitle
                initialValue={gasPriceMultiplier}
                onDragStop={this.handleChangeGasPrice}
              />
            </div>}

          </div>
          <div styleName='footer'>
            {additionalActionIsFailed &&
            <Button
              flat
              styleName='action'
              label={<Translate value={additionalAction.repeatButtonName()} />}
              onClick={this.handleRepeatAction}
            />
            }
            <Button
              flat
              styleName='action'
              label={<Translate value='terms.cancel' />}
              onClick={this.handleClose}
            />
            <Button
              styleName='action'
              label={<Translate value='terms.confirm' />}
              disabled={gasFee.lte(0) || balanceAfter.lt(0) || balance.lt(0) || additionalActionIsFailed}
              onClick={this.handleConfirm}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
