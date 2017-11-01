import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { modalsClose } from 'redux/modals/actions'

import LOCStatusForm from './LOCStatusForm'
import ModalDialogBase from '../../ModalDialogBase/ModalDialogBase'
import { updateStatus } from '../../../../redux/locs/actions'

const mapDispatchToProps = (dispatch) => ({
  updateStatus: (status, loc) => dispatch(updateStatus(status, loc)),
  closeModal: () => dispatch(modalsClose()),
})

@connect(null, mapDispatchToProps)
class IssueLHModal extends PureComponent {
  static propTypes = {
    loc: PropTypes.object,
    closeModal: PropTypes.func,
    updateStatus: PropTypes.func,
  }
  handleSubmitSuccess = (status: number) => {
    this.props.closeModal()
    this.props.updateStatus(status, this.props.loc)
  }

  render () {
    return (
      <ModalDialogBase title='locs.updateStatus'>
        <LOCStatusForm
          initialValues={{ status: this.props.loc.status() }}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialogBase>
    )
  }
}

export default IssueLHModal
