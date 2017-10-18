import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { addLOC, updateLOC } from 'redux/locs/actions'
import { modalsClose } from 'redux/modals/actions'

import LOCForm from './LOCForm'
import type LOCModel from '../../../../models/LOCModel'
import ModalDialogBase from '../../ModalDialogBase/ModalDialogBase'

const mapDispatchToProps = dispatch => ({
  addLOC: (loc: LOCModel) => dispatch(addLOC(loc)),
  updateLOC: (loc: LOCModel) => dispatch(updateLOC(loc)),
  closeModal: () => dispatch(modalsClose()),
})

@connect(null, mapDispatchToProps)
class LOCDialog extends Component {
  static propTypes = {
    loc: PropTypes.object,
    addLOC: PropTypes.func,
    updateLOC: PropTypes.func,
    closeModal: PropTypes.func,
  }

  handleSubmitSuccess = (locModel: LOCModel) => {
    this.props.closeModal()
    if (this.props.loc.isNew()) {
      this.props.addLOC(locModel)
    } else {
      this.props.updateLOC(locModel)
    }
  }

  render() {
    const { loc } = this.props
    const isNew = loc.isNew()

    return (
      <ModalDialogBase title={isNew ? 'locs.create' : 'locs.edit'}>
        <LOCForm
          loc={loc}
          initialValues={loc.toFormJS()}
          onSubmitSuccess={this.handleSubmitSuccess}
          onDelete={() => this.props.closeModal()}
        />
      </ModalDialogBase>
    )
  }
}

export default LOCDialog
