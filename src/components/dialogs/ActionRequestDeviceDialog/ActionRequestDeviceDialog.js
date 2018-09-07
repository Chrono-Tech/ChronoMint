/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Translate } from 'react-redux-i18n'
import TokenPrice from 'components/common/TokenPrice/TokenPrice'
import React, { PureComponent } from 'react'
import Button from 'components/common/ui/Button/Button'

import Amount from '@chronobank/core/models/Amount'
import TxExecModel from '@chronobank/core/models/TxExecModel'
import TxEntryModel from '@chronobank/core/models/TxEntryModel'

import { modalsClear, modalsClose } from 'redux/modals/actions'
import { getWallet } from '@chronobank/core/redux/wallets/selectors/models'

import Value from 'components/common/Value/Value'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ModalDialog from 'components/dialogs/ModalDialog'
import Preloader from 'components/common/Preloader/Preloader'

import './ConfirmTransferDialog.scss'

const mapStateToProps = (state, ownProps) => {
  const { tx } = ownProps.entry
  const wallet = getWallet(`${tx.blockchain}-${tx.from}`)(state)
  return ({
    amountBalance: wallet.balances[tx.amountToken.symbol()],
    feeBalance: wallet.balances[tx.feeToken.symbol()],
  })
}

function mapDispatchToProps (dispatch) {
  return {
    modalsClear: () => dispatch(modalsClear()),
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ConfirmTransferDialog extends PureComponent {
  static propTypes = {
    confirm: PropTypes.func.isRequired,
    reject: PropTypes.func.isRequired,
    modalsClear: PropTypes.func.isRequired,
    modalsClose: PropTypes.func.isRequired,
    entry: PropTypes.instanceOf(TxEntryModel),
    amountBalance: PropTypes.instanceOf(Amount),
    feeBalance: PropTypes.instanceOf(Amount),
  }

  constructor (props) {
    super(props)

    const { tx } = props.entry

    this.state = {
      feeMultiplier: tx && tx.feeMultiplier,
    }
  }

  handleConfirm = () => {
    const { entry } = this.props

    this.props.modalsClear()

    const updatedEntry = new TxEntryModel({
      ...entry,
      tx: new TxExecModel({
        ...entry.tx,
        feeMultiplier: this.state.feeMultiplier,
      }),
    })

    this.props.confirm(updatedEntry)
  }

  handleClose = () => {
    const { entry } = this.props

    this.props.modalsClose()

    const updatedEntry = new TxEntryModel({
      ...entry,
      tx: new TxExecModel({
        ...entry.tx,
        feeMultiplier: this.state.feeMultiplier,
      }),
    })

    this.props.reject(updatedEntry)
  }

  handleChangeFee = (feeMultiplier) => {
    this.setState({
      feeMultiplier,
    })
  }

  getDetails ({ tx, amountToken, amountBalance, amountBalanceAfter, feeToken, feeBalance, feeBalanceAfter, feeMultiplier }) {

    const feeDetails = feeToken === amountToken ? [] : [
      { key: 'feeBalance', type: 'TokenValue', label: 'tx.General.transfer.params.feeBalance', value: feeBalance },
      { key: 'feeBalanceAfter', type: 'TokenValue', label: 'tx.General.transfer.params.feeBalanceAfter', value: feeBalanceAfter },
    ]

    const basicDetails = [
      { key: 'operation', type: 'String', label: 'tx.General.transfer.params.operation', value: tx.operation },
      { key: 'amount', type: 'TokenValue', label: 'tx.General.transfer.params.amount', value: new Amount(tx.amount, tx.amountToken.symbol()) },
      { key: 'amountBalance', type: 'TokenValue', label: 'tx.General.transfer.params.balance', value: amountBalance },
      { key: 'amountBalanceAfter', type: 'TokenValue', label: 'tx.General.transfer.params.balanceAfter', value: amountBalanceAfter },
      { key: 'fee', type: 'TokenValue', label: 'tx.General.transfer.params.fee', value: new Amount(tx.fee.mul(feeMultiplier), tx.feeToken.symbol()) },
      ...feeDetails,
      { key: 'hash', type: 'String', label: 'tx.General.transfer.params.hash', value: tx.hash },
    ].filter(({ value }) => value != null) // nil check

    return [
      ...basicDetails,
    ]
  }

  renderValue ({ type, value }) {
    if (value == null) { // nil check
      return null
    }
    switch (type) {
      case 'Amount':
      case 'TokenValue':
        return <TokenValue value={value} />
      case 'Preloader':
      case 'Progress':
        return <Preloader />
      case 'BigNumber':
      default:
        return <Value value={value} />
    }
  }

  render () {
    const { amountBalance, feeBalance, entry } = this.props
    const { feeMultiplier } = this.state
    const { tx } = entry

    const fee = tx.fee.mul(feeMultiplier)
    const feeToken = tx.feeToken
    const amount = tx.amount
    const amountToken = tx.amountToken

    let amountBalanceAfter = amountBalance.minus(amount)
    let feeBalanceAfter = null
    if (feeToken === amountToken) {
      feeBalanceAfter = amountBalanceAfter = amountBalanceAfter.minus(fee)
    } else {
      feeBalanceAfter = feeBalance.minus(fee)
    }

    const details = this.getDetails({
      tx,
      amountToken,
      amountBalance,
      amountBalanceAfter,
      feeToken,
      feeBalance,
      feeBalanceAfter,
      feeMultiplier,
    })

    const isValid = fee.gt(0) && feeBalanceAfter.gte(0) || amountBalanceAfter.gte(0)

    return (
      <ModalDialog hideCloseIcon title={<Translate value={tx.title} />}>
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='paramsList'>
              {details.map(({ key, type, label, value }) => {
                if (key === 'amount') {
                  return (
                    <div styleName='param' key={key}>
                      <div styleName={classnames('value', { 'big': key === 'amount' })}>
                        <Value value={value} params={{ noRenderPrice: true }} />
                      </div>
                      <div styleName='price'>USD <TokenPrice value={value} isRemoveDecimals /></div>
                    </div>
                  )
                }
                return (
                  <div styleName='param' key={key}>
                    <div styleName='label'>
                      <Translate value={label} />
                    </div>
                    <div styleName='value'>
                      {this.renderValue({ type, value })}
                    </div>
                  </div>
                )
              })}
            </div>
            {!isValid && (
              <div styleName='errorMessage'>
                <div styleName='error'>Not enough coins</div>
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
              disabled={!isValid}
              onClick={isValid ? this.handleConfirm : undefined}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
