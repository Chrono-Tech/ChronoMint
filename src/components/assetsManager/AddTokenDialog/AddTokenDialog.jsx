import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import AddTokenForm from './AddTokenForm'

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => dispatch(modalsClose()),
    closeModal: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class AddPlatformDialog extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    closeModal: PropTypes.func,
  }

  handleSubmitSuccess = () => {
    this.props.closeModal()
  }

  render () {
    return (
      <ModalDialog onClose={() => this.props.onClose()}>
        <AddTokenForm
          handleClose={this.props.onClose}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialog>
    )
  }
}
