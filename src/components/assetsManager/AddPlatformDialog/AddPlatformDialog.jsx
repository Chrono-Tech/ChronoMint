import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import AddPlatformForm from './AddPlatformForm'

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmitSuccess: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class AddPlatformDialog extends React.Component {
  static propTypes = {
    onSubmitSuccess: PropTypes.func,
    onClose: PropTypes.func,
    closeModal: PropTypes.func,
  }

  render () {
    return (
      <ModalDialog onClose={() => this.props.onClose()}>
        <AddPlatformForm onSubmitSuccess={this.props.onSubmitSuccess} />
      </ModalDialog>
    )
  }
}
