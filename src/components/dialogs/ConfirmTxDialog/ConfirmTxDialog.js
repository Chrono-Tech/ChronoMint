import TokenValue from 'components/common/TokenValue/TokenValue'
import Value from 'components/common/Value/Value'
import ModalDialog from 'components/dialogs/ModalDialog'
import { CircularProgress, FlatButton, Table, TableBody, TableRow, TableRowColumn } from 'material-ui'
import Amount from 'models/Amount'
import TxExecModel from 'models/TxExecModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_MAIN_WALLET, ETH } from 'redux/mainWallet/actions'
import { modalsClose } from 'redux/modals/actions'
import { DUCK_WATCHER, WATCHER_TX_SET } from 'redux/watcher/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import Preloader from 'components/common/Preloader/Preloader'

import './ConfirmTxDialog.scss'

const mapStateToProps = (state) => {
  return ({
    balance: state.get(DUCK_MAIN_WALLET).balances().item(ETH).amount(),
    tx: state.get(DUCK_WATCHER).confirmTx,
    gasPriceMultiplier: state.get(DUCK_SESSION).gasPriceMultiplier.get(ETH) || 1,
  })
}

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
    handleUpdateTx: (tx) => dispatch({ type: WATCHER_TX_SET, tx }),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ConfirmTxDialog extends PureComponent {
  static propTypes = {
    callback: PropTypes.func.isRequired,
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

  componentWillReceiveProps (newProps) {
    if (newProps.tx.gas().gt(0) && this.props.tx.gas().eq(0)) {
      this.props.handleUpdateTx(newProps.tx.setGas(newProps.tx.gas().mul(newProps.gasPriceMultiplier)))
    }
  }

  handleRepeatAction () {
    const additionalAction = this.props.tx.additionalAction()
    if (additionalAction) {
      additionalAction
        .action()
        .then((result) => {
          const { tx } = this.props
          const newParams = tx.params().concat(Object.values(result.value()))
          const newTx = this.props.tx.params(newParams).additionalAction(result)

          this.props.handleUpdateTx(newTx)
          this.props.handleEstimateGas(tx.funcName(), newTx.params(), tx.value())
        })
    } else {
      const { tx, handleEstimateGas } = this.props
      handleEstimateGas(tx.funcName(), tx.params(), tx.value())
    }
  }

  handleConfirm = () => {
    this.props.modalsClose()
    this.props.callback(true, this.props.tx)
  }

  handleClose = () => {
    this.props.modalsClose()
    this.props.callback(false, this.props.tx)
  }

  getActions () {
    return [
      <FlatButton
        key='close'
        label={<Translate value='terms.cancel' />}
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        key='confirm'
        label={<Translate value='terms.confirm' />}
        primary
        disabled={this.props.balance.lt(0)}
        onTouchTap={this.handleConfirm}
      />,
    ]
  }

  getKeyValueRows (args, tokenBase) {
    return Object.keys(args).map((key) => {
      const arg = args[ key ]
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

  render () {
    const { tx, balance } = this.props
    const gasFee = tx.gas()
    const balanceAfter = balance.minus(tx.value() || 0).minus(gasFee)
    const additionalAction = tx.additionalAction()
    return (
      <ModalDialog onModalClose={this.handleClose}>
        <div styleName='root'>
          <div styleName='header'><h3 styleName='headerHead'><Translate value={tx.func()} /></h3></div>
          <div styleName='content'>
            <div>
              <Table selectable={false} className='adaptiveTable'>
                <TableBody displayRowCheckbox={false}>
                  {this.getKeyValueRows(tx.args(), tx.i18nFunc())}

                  {additionalAction && additionalAction.isFetched() && this.getKeyValueRows(additionalAction.value(), tx.i18nFunc())}
                  <TableRow key='txFee'>
                    <TableRowColumn style={{ width: '35%' }}>
                      <Translate value='tx.fee' />
                    </TableRowColumn>
                    <TableRowColumn style={{ width: '65%' }}>
                      {gasFee.gt(0)
                        ? <TokenValue
                          prefix='&asymp;&nbsp;'
                          value={new Amount(gasFee, ETH)}
                        />
                        : <CircularProgress size={16} thickness={1.5} />
                      }
                    </TableRowColumn>
                  </TableRow>

                  <TableRow key='txBalanceAfter'>
                    <TableRowColumn style={{ width: '35%' }}>
                      <Translate value='tx.balanceAfter' />
                    </TableRowColumn>
                    <TableRowColumn style={{ width: '65%' }}>
                      {gasFee.gt(0)
                        ? <TokenValue
                          prefix='&asymp;&nbsp;'
                          value={new Amount(balanceAfter, ETH)}
                        />
                        : <CircularProgress size={16} thickness={1.5} />}
                    </TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
              {balance.lt(0) && <div styleName='error'>Not enough ETH</div>}
            </div>

            {additionalAction && additionalAction.isFailed() && <Translate value={additionalAction.message()} />}

          </div>
          <div styleName='footer'>
            {additionalAction && additionalAction.isFailed() &&
            <FlatButton
              styleName='action'
              label={<Translate value={additionalAction.repeatButtonName} />}
              onTouchTap={this.handleClose}
            />
            }

            <FlatButton
              styleName='action'
              label={<Translate value='terms.cancel' />}
              onTouchTap={this.handleClose}
            />
            <FlatButton
              styleName='action'
              primary
              label={<Translate value='terms.confirm' />}
              disabled={gasFee.lte(0) || balance.lt(0)}
              onTouchTap={this.handleConfirm}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
