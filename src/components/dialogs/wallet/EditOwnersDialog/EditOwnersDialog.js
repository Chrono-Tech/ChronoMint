import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { addOwner, removeOwner } from 'redux/multisigWallet/actions'
import { modalsClose } from 'redux/modals/actions'
import EditManagersBaseForm from 'components/forms/EditManagersBaseForm/EditManagersBaseForm'
import ModalDialog from 'components/dialogs/ModalDialog'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
    handleRemoveOwner: (wallet, address) => dispatch(removeOwner(wallet, address)),
    handleAddOwner: (wallet, address) => dispatch(addOwner(wallet, address)),
  }
}

@connect(null, mapDispatchToProps)
class EditManagersDialog extends PureComponent {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    modalsClose: PropTypes.func,
    handleRemoveOwner: PropTypes.func,
    handleAddOwner: PropTypes.func,
  }

  handleRemove = (address) => {
    this.props.modalsClose()
    this.props.handleRemoveOwner(this.props.wallet, address)
  }

  handleAdd = (address) => {
    this.props.modalsClose()
    this.props.handleAddOwner(this.props.wallet, address)
  }

  render () {
    const { wallet } = this.props
    return (
      <ModalDialog>
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
