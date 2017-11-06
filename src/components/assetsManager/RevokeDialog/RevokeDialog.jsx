import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import RevokeForm from './RevokeForm'

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmitSuccess: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class RevokeDialog extends PureComponent {
  static propTypes = {
    onSubmitSuccess: PropTypes.func,
    onClose: PropTypes.func,
    closeModal: PropTypes.func,
  }

  render () {
    return (
      <ModalDialog onClose={() => this.props.onClose()}>
        <RevokeForm onSubmitSuccess={this.props.onSubmitSuccess} />
      </ModalDialog>
    )
  }
}
