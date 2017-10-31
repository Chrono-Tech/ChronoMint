import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import AssetManagerForm from './AssetManagerForm'

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    closeModal: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class AssetManagerDialog extends React.Component {
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
        <AssetManagerForm
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialog>
    )
  }
}
