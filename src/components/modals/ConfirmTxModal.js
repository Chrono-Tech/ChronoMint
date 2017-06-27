import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FlatButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui'
import { Translate } from 'react-redux-i18n'
import globalStyles from '../../styles'
import ModalBase from './ModalBase/ModalBase'

class ConfirmTxModal extends Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    open: PropTypes.bool,
    tx: PropTypes.object,
    plural: PropTypes.object
  }

  handleConfirm = () => {
    this.props.hideModal()
    this.props.callback(true)
  }

  handleClose = () => {
    this.props.hideModal()
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
        onTouchTap={this.handleConfirm}
      />
    ]
  }

  getKeyValueRows (args, tokenBase) {
    return Object.keys(args).map((key) => (
      <TableRow key={key}>
        <TableRowColumn>
          <Translate value={tokenBase + key} />
        </TableRowColumn>
        <TableRowColumn>{args[key]}</TableRowColumn>
      </TableRow>
    ))
  }

  render () {
    const {tx, plural} = this.props
    const args = tx.args()

    // TODO @dkchv: add balance
    return (
      <ModalBase
        title='tx.confirm'
        onClose={this.handleClose}
        actions={this.getActions()}
        open={this.props.open}
      >
        <div style={globalStyles.greyText}>
          {plural ? (
            <div>
              <div style={globalStyles.warning}>
                <div><Translate value='tx.pluralTxWarning' /></div>
                <div style={globalStyles.warningStep}>
                  <Translate value='tx.pluralTxStep' step={plural.step} of={plural.of} />
                </div>
                <div>All Transactions cost: {plural.totalGas} ETH</div>
                <div>Balance after transactions: ???</div>
              </div>
            </div>
          ) : (
            <div>Transaction costs: {tx.costWithFee()} ETH</div>
          )}

          <div>Action: <span><Translate value={tx.func()} /></span></div>
          {Object.keys(args).length > 0 && (
            <div>
              <div>Details:</div>
              <Table selectable={false}>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                  <TableRow>
                    <TableHeaderColumn>
                      <Translate value='terms.parameter' />
                    </TableHeaderColumn>
                    <TableHeaderColumn>
                      <Translate value='terms.value' />
                    </TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {this.getKeyValueRows(args, tx.i18nFunc())}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </ModalBase>
    )
  }
}

export default ConfirmTxModal
