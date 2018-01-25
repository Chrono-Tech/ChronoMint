import ModalDialog from 'components/dialogs/ModalDialog'
import EditSignaturesForm from 'components/dialogs/wallet/EditSignaturesDialog/EditSignaturesForm'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsClose } from 'redux/modals/actions'
import { changeRequirement } from 'redux/multisigWallet/actions'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
    handleAddOwner: (newRequired) => dispatch(changeRequirement(newRequired)),
  }
}

@connect(null, mapDispatchToProps)
export default class EditSignaturesDialog extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    modalsClose: PropTypes.func,
    handleRemoveOwner: PropTypes.func,
    handleAddOwner: PropTypes.func,
  }

  handleSubmitSuccess = (newRequired) => {
    this.props.modalsClose()
    this.props.handleAddOwner(this.props.wallet, newRequired)
  }

  render () {
    return (
      <ModalDialog>
        <EditSignaturesForm
          initialValues={this.props.wallet.toRequiredSignaturesFormJS()}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialog>
    )
  }
}