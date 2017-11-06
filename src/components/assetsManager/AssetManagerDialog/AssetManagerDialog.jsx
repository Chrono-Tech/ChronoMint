import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import AssetManagerForm from './AssetManagerForm'

function mapDispatchToProps (dispatch) {
  return {
    handleClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class AssetManagerDialog extends React.Component {
  static propTypes = {
    handleClose: PropTypes.func,
  }

  handleClose = () => {
    this.props.handleClose()
  }

  handleSubmitSuccess = () => {
    this.handleClose()
  }

  render () {
    return (
      <ModalDialog onClose={this.handleClose}>
        <AssetManagerForm onSubmitSuccess={this.handleSubmitSuccess} />
      </ModalDialog>
    )
  }
}
