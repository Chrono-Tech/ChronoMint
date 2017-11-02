import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsClose } from 'redux/modals/actions'
import ModalDialog from 'components/dialogs/ModalDialog'
import CrowdsaleForm from './CrowdsaleForm'

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => {
      dispatch(modalsClose())
    },
    closeModal: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class CrowdsaleDialog extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    submitting: PropTypes.bool,
    closeModal: PropTypes.func,
  }

  handleSubmitSuccess = () => {
    this.props.closeModal()
  }

  render () {
    return (
      <ModalDialog onClose={() => this.props.onClose()}>
        <CrowdsaleForm handleSubmit={this.handleSubmitSuccess} />
      </ModalDialog>
    )
  }
}
