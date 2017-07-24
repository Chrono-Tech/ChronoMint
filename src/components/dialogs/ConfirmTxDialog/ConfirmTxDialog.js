import React, { Component } from 'react'
import BigNumber from 'bignumber.js'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CircularProgress, FlatButton, Table, TableBody, TableRow, TableRowColumn } from 'material-ui'
import { Translate } from 'react-redux-i18n'
import type TxExecModel from 'models/TxExecModel'
import ModalDialog from '../ModalDialog'
import { CSSTransitionGroup } from 'react-transition-group'
import { modalsClose } from 'redux/modals/actions'
import { ETH } from 'redux/wallet/actions'
import TokenValue from 'components/dashboard/TokenValue/TokenValue'
import './ConfirmTxDialog.scss'

const mapStateToProps = state => ({
  balance: state.get('wallet').tokens.get(ETH).balance(),
  tx: state.get('watcher').confirmTx
})

function mapDispatchToProps (dispatch) {
  return {
    handleClose: () => dispatch(modalsClose())
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class ConfirmTxDialog extends Component {

  static propTypes = {
    callback: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    tx: PropTypes.object,
    balance: PropTypes.object
  }

  handleConfirm = () => {
    this.props.handleClose()
    this.props.callback(true)
  }

  handleClose = () => {
    this.props.handleClose()
    this.props.callback(false)
  }

  getActions () {
    return [
      <FlatButton
        key='close'
        label={<Translate value='terms.cancel'/>}
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        key='confirm'
        label={<Translate value='terms.confirm'/>}
        primary
        disabled={this.getBalanceLeft().lt(0)}
        onTouchTap={this.handleConfirm}
      />
    ]
  }

  getKeyValueRows (args, tokenBase) {
    return Object.keys(args).map((key) => (
      <TableRow key={key}>
        <TableRowColumn style={{width: '35%'}}>
          <Translate value={tokenBase + key}/>
        </TableRowColumn>
        <TableRowColumn style={{width: '65%'}}>
          {args[key] && typeof args[key] === 'object' && args[key].constructor && args[key].constructor.name === 'BigNumber' ? <TokenValue
            value={args[key]}/> : args[key]}
        </TableRowColumn>
      </TableRow>
    ))
  }

  getGasFee (): BigNumber {
    const tx: TxExecModel = this.props.tx
    return tx.gas()
  }

  getBalanceLeft (): BigNumber {
    return this.props.balance.minus(this.getGasFee())
  }

  render () {
    const tx: TxExecModel = this.props.tx
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.handleClose()}>
          <div styleName='root'>
            <div styleName='header'><h3><Translate value={tx.func()}/></h3></div>
            <div styleName='content'>
              <div>
                <Table selectable={false}>
                  <TableBody displayRowCheckbox={false}>
                    {this.getKeyValueRows(tx.args(), tx.i18nFunc())}

                    <TableRow key={'txFee'}>
                      <TableRowColumn style={{width: '35%'}}>
                        <Translate value='tx.fee'/>
                      </TableRowColumn>
                      <TableRowColumn style={{width: '65%'}}>
                        {this.getGasFee().gt(0)
                          ? <TokenValue
                            prefix='&asymp;&nbsp;'
                            value={this.getGasFee()}
                            symbol={ETH}/>
                          : <CircularProgress size={16} thickness={1.5}/>
                        }
                      </TableRowColumn>
                    </TableRow>

                    <TableRow key={'txBalanceAfter'}>
                      <TableRowColumn style={{width: '35%'}}>
                        <Translate value='tx.balanceAfter'/>
                      </TableRowColumn>
                      <TableRowColumn style={{width: '65%'}}>
                        {this.getGasFee().gt(0)
                          ? <TokenValue
                            prefix='&asymp;&nbsp;'
                            value={this.getBalanceLeft()}
                            symbol={ETH}/>
                          : <CircularProgress size={16} thickness={1.5}/>}
                      </TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
                {this.getBalanceLeft().lt(0) && <div styleName='error'>Not enough ETH</div>}
              </div>

            </div>
            <div styleName='footer'>
              <FlatButton
                styleName='action'
                label={<Translate value='terms.cancel'/>}
                onTouchTap={this.handleClose}
              />
              <FlatButton
                styleName='action'
                primary
                label={<Translate value='terms.confirm'/>}
                disabled={this.getGasFee().lte(0) || this.getBalanceLeft().lt(0)}
                onTouchTap={this.handleConfirm}
              />
            </div>
          </div>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

export default ConfirmTxDialog
