import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import EditManagersBaseForm from 'components/forms/EditManagersBaseForm/EditManagersBaseForm'
import { addOwner, removeOwner } from 'redux/multisigWallet/actions'
import { modalsClose } from 'redux/modals/actions'
import ModalDialog from 'components/dialogs/ModalDialog'

function mapDispatchToProps (dispatch) {
  return {
    handleClose: () => dispatch(modalsClose()),
    handleRemoveOwner: (wallet, address) => dispatch(removeOwner(wallet, address)),
    handleAddOwner: (wallet, address) => dispatch(addOwner(wallet, address)),
  }
}

@connect(null, mapDispatchToProps)
class EditManagersDialog extends PureComponent {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    handleClose: PropTypes.func,
    handleRemoveOwner: PropTypes.func,
    handleAddOwner: PropTypes.func,
  }

  handleClose = () => {
    this.props.handleClose()
  }

  handleRemove = address => {
    this.props.handleClose()
    this.props.handleRemoveOwner(this.props.wallet, address)
  }

  handleAdd = address => {
    this.props.handleClose()
    this.props.handleAddOwner(this.props.wallet, address)
  }

  render () {
    const { wallet } = this.props
    return (
      <ModalDialog onClose={this.handleClose}>
        <EditManagersBaseForm
          managers={wallet.owners().valueSeq().toArray()}
          onRemove={this.handleRemove}
          onSubmitSuccess={this.handleAdd}
        />
      </ModalDialog>
    )
  }
}

export default EditManagersDialog
