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
    tx: PropTypes.object
  }

  handleConfirm = () => {
    this.props.hideModal()
    this.props.callback(true)
  }

  handleClose = () => {
    this.props.hideModal()
    this.props.callback(false)
  }

  render () {
    const actions = [
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

    this.props.tx.map((a, b, c, d) => {
      // TODO @dkchv: !!!
      console.log('--ConfirmTxModal#', a, b, c, d)
    })

    return (
      <ModalBase
        title='tx.confirm'
        onClose={this.handleClose}
        actions={actions}
        open={this.props.open}
      >
        <div style={globalStyles.greyText}>
          Details:
          <Table selectable={false}>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>
                  <Translate value='terms.parameter' />
                </TableHeaderColumn>
                <TableHeaderColumn>
                  <Translate value='terms.value' />
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRowColumn>key</TableRowColumn>
              <TableRowColumn>value</TableRowColumn>
            </TableBody>
          </Table>
        </div>
      </ModalBase>
    )
  }
}

export default ConfirmTxModal
