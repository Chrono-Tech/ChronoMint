import { CSSTransitionGroup } from 'react-transition-group'
import { CircularProgress, FlatButton, Table, TableBody, TableRow, TableRowColumn } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'

import { ETH } from 'redux/wallet/actions'
import { modalsClose } from 'redux/modals/actions'

import Moment, { FULL_DATE } from 'components/common/Moment/index'
import TokenValue from 'components/common/TokenValue/TokenValue'

import ModalDialog from '../ModalDialog'

import './ConfirmTxDialog.scss'

const mapStateToProps = state => ({
  balance: state.get('wallet').tokens.get(ETH).balance(),
  tx: state.get('watcher').confirmTx,
})

function mapDispatchToProps (dispatch) {
  return {
    handleClose: () => dispatch(modalsClose()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class ConfirmTxDialog extends Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    tx: PropTypes.object,
    balance: PropTypes.object,
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
    return Object.keys(args).map(key => {
      const arg = args[key]
      let value

      if (arg === null) {
        return
      }
      // parse value
      switch (arg.constructor.name) {
        case 'BigNumber':
          // TODO @dkchv: harcoded symbol!
          value = <TokenValue value={arg} symbol='TIME' />
          break
        case 'Date':
          value = <Moment date={arg} format={FULL_DATE} />
          break
        case 'Array':
          value = arg.join(', ')
          break
        case 'Object':
          if (React.isValidElement(arg)) {
            value = arg
          } else {
            return this.getKeyValueRows(arg, tokenBase)
          }
          break
        default:
          value = arg
      }

      return (
        <TableRow key={key}>
          <TableRowColumn style={{ width: '35%' }}>
            <Translate value={tokenBase + key} />
          </TableRowColumn>
          <TableRowColumn style={{ width: '65%' }}>
            {value}
          </TableRowColumn>
        </TableRow>
      )
    })
  }

  render () {
    const { tx, balance } = this.props
    const gasFee = tx.gas()
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        <ModalDialog onClose={() => this.handleClose()}>
          <div styleName='root'>
            <div styleName='header'><h3 styleName='headerHead'><Translate value={tx.func()} /></h3></div>
            <div styleName='content'>
              <div>
                <Table selectable={false} className='adaptiveTable'>
                  <TableBody displayRowCheckbox={false}>
                    {this.getKeyValueRows(tx.args(), tx.i18nFunc())}

                    <TableRow key='txFee'>
                      <TableRowColumn style={{ width: '35%' }}>
                        <Translate value='tx.fee' />
                      </TableRowColumn>
                      <TableRowColumn style={{ width: '65%' }}>
                        {gasFee.gt(0)
                          ? <TokenValue
                            prefix='&asymp;&nbsp;'
                            value={gasFee}
                            symbol={ETH}
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
                            value={balance}
                            symbol={ETH}
                          />
                          : <CircularProgress size={16} thickness={1.5} />}
                      </TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
                {balance.lt(0) && <div styleName='error'>Not enough ETH</div>}
              </div>

            </div>
            <div styleName='footer'>
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
      </CSSTransitionGroup>
    )
  }
}

export default ConfirmTxDialog
