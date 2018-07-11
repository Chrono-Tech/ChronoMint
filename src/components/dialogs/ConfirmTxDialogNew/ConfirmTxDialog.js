/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokenValue from 'components/common/TokenValue/TokenValue'
import BigNumber from 'bignumber.js'
import Value from 'components/common/Value/Value'
import ModalDialog from 'components/dialogs/ModalDialog'
import Amount from '@chronobank/core/models/Amount'
import classnames from 'classnames'
import Button from 'components/common/ui/Button/Button'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { ETH } from '@chronobank/core/redux/mainWallet/actions'
import { modalsClear, modalsClose } from 'redux/modals/actions'
import { WATCHER_TX_SET } from '@chronobank/core/redux/watcher/actions'
import GasSlider from 'components/common/GasSlider/GasSlider'
import Preloader from 'components/common/Preloader/Preloader'
import TokenPrice from 'components/common/TokenPrice/TokenPrice'
import { getDataForConfirm } from '@chronobank/core/refactor/redux/transactions'

import './ConfirmTxDialog.scss'

const makeMapStateToProps = (state, ownProps) => {
  const { tx } = ownProps
  return (ownState, ownProps) => {
    return ({
      data: getDataForConfirm(tx)(state),
    })
  }
}

function mapDispatchToProps (dispatch) {
  return {
    modalsClear: () => dispatch(modalsClear()),
    modalsClose: () => dispatch(modalsClose()),
    handleUpdateTx: (tx) => dispatch({ type: WATCHER_TX_SET, tx }),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class ConfirmTxDialogNew extends PureComponent {
  static propTypes = {
    confirm: PropTypes.func.isRequired,
    reject: PropTypes.func.isRequired,
    modalsClear: PropTypes.func.isRequired,
    modalsClose: PropTypes.func.isRequired,
    tx: PropTypes.object,
    feeMultiplier: PropTypes.number,
  }

  componentDidMount () {
    this.handleRepeatAction()
  }

  handleConfirm = () => {
    this.props.modalsClear()
    this.props.callback(true, this.props.tx)
  }

  handleClose = () => {
    this.props.modalsClose()
    this.props.callback(false, this.props.tx)
  }

  getKeyValueRows (args, tokenBase) {
    return Object.keys(args).map((key) => {
      const arg = args[key]

      if (key === 'value') {
        return (
          <div styleName='param' key={key}>
            <div styleName={classnames('value', { 'big': key === 'value' })}>
              <Value value={arg} params={{ noRenderPrice: true }} />
            </div>
            <div styleName='price'>USD <TokenPrice value={new Amount(arg, ETH)} isRemoveDecimals /></div>
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
    // const { tx, balance, gasPriceMultiplier } = this.props
    // eslint-disable-next-line
    console.log('render', this.props)

    return null
    return (
      <ModalDialog hideCloseIcon title={<Translate value={tx.func()} />}>
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='paramsList'>
              {this.getKeyValueRows(tx.args(), tx.i18nFunc())}

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
