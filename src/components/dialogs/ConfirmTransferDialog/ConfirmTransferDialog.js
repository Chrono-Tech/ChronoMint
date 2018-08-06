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
import BalanceModel from '@chronobank/core/models/tokens/BalanceModel'
import TransferExecModel from '@chronobank/core/models/TransferExecModel'
import BitcoinDAO from '@chronobank/core/dao/BitcoinDAO'
import NemDAO from '@chronobank/core/dao/NemDAO'
import WavesDAO from '@chronobank/core/dao/WavesDAO'

import { modalsClear, modalsClose } from 'redux/modals/actions'
import { getWalletBalanceForSymbol } from '@chronobank/core/redux/wallet/selectors'
import { getWallet } from '@chronobank/core/redux/wallets/selectors/models'

import Value from 'components/common/Value/Value'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ModalDialog from 'components/dialogs/ModalDialog'
import Preloader from 'components/common/Preloader/Preloader'

import './ConfirmTransferDialog.scss'

const mapStateToProps = (state, ownProps) => {
  const { tx } = ownProps
  const wallet = getWallet(`${tx.blockchain}-${tx.from}`)(state)
  return ({
    amountBalance: getWalletBalanceForSymbol(tx.from(), tx.amountToken().blockchain(), tx.amountToken().symbol())(state),
    feeBalance: wallet.balances[tx.feeToken().symbol()],
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
    tx: PropTypes.instanceOf(TransferExecModel),
    // TODO @ipavlenko: Replace with redux binding when DAOs collection will be moved to the redux, use feeToken from props.tx to get DAO
    dao: PropTypes.oneOfType([
      PropTypes.instanceOf(BitcoinDAO),
      PropTypes.instanceOf(NemDAO),
      PropTypes.instanceOf(WavesDAO),
    ]),
    amountBalance: PropTypes.instanceOf(BalanceModel),
    feeBalance: PropTypes.instanceOf(BalanceModel),
    feeMultiplier: PropTypes.number,
  }

  constructor (props) {
    super(props)
    this.state = {
      feeMultiplier: props.tx.feeMultiplier(),
    }
  }

  handleConfirm = () => {
    this.props.modalsClear()
    const tx = this.props.tx.feeMultiplier(this.state.feeMultiplier)
    this.props.confirm(tx)
  }

  handleClose = () => {
    this.props.modalsClose()
    const tx = this.props.tx.feeMultiplier(this.state.feeMultiplier)
    this.props.reject(tx)
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
      { key: 'operation', type: 'String', label: 'tx.General.transfer.params.operation', value: tx.operation() },
      { key: 'amount', type: 'TokenValue', label: 'tx.General.transfer.params.amount', value: new Amount(tx.amount(), tx.amountToken().symbol()) },
      { key: 'amountBalance', type: 'TokenValue', label: 'tx.General.transfer.params.balance', value: amountBalance },
      { key: 'amountBalanceAfter', type: 'TokenValue', label: 'tx.General.transfer.params.balanceAfter', value: amountBalanceAfter },
      { key: 'fee', type: 'TokenValue', label: 'tx.General.transfer.params.fee', value: new Amount(tx.fee().mul(feeMultiplier), tx.feeToken().symbol()) },
      ...feeDetails,
      { key: 'hash', type: 'String', label: 'tx.General.transfer.params.hash', value: tx.hash() },
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
    const { tx, amountBalance, feeBalance } = this.props
    const { feeMultiplier } = this.state

    const fee = tx.fee().mul(feeMultiplier)
    const feeToken = tx.feeToken()
    const amount = tx.amount()
    const amountToken = tx.amountToken()

    let amountBalanceAfter = amountBalance.amount().minus(amount)
    let feeBalanceAfter = null
    if (feeToken === amountToken) {
      feeBalanceAfter = amountBalanceAfter = amountBalanceAfter.minus(fee)
    } else {
      feeBalanceAfter = feeBalance.amount().minus(fee)
    }

    const details = this.getDetails({
      tx,
      amountToken,
      amountBalance: amountBalance.amount(),
      amountBalanceAfter,
      feeToken,
      feeBalance: feeBalance.amount(),
      feeBalanceAfter,
      feeMultiplier,
    })

    const isValid = fee.gt(0) && feeBalanceAfter.gte(0) || amountBalanceAfter.gte(0)

    return (
      <ModalDialog hideCloseIcon title={<Translate value={tx.title()} />}>
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
