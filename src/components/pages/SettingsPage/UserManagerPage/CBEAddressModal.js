import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatButton, RaisedButton } from 'material-ui'
import CBEAddressForm from './CBEAddressForm'
import CBEModel from '../../../../models/CBEModel'
import { addCBE } from '../../../../redux/settings/userManager/cbe'
import ModalBase from '../../../modals/ModalBase/ModalBase'

const mapDispatchToProps = (dispatch) => ({
  save: (cbe: CBEModel) => dispatch(addCBE(cbe))
})

@connect(null, mapDispatchToProps)
class CBEAddressModal extends Component {
  handleSubmit = (values) => {
    this.props.save(new CBEModel({
      address: values.get('address'),
      name: values.get('name')
    }))
    this.handleClose()
  }

  handleSubmitClick = () => {
    this.cbeAddressForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const actions = [
      <FlatButton
        key='cancel'
        label='Cancel'
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        key='add'
        label={'Add Address'}
        primary
        onTouchTap={this.handleSubmitClick}
      />
    ]

    return (
      <ModalBase
        title={'Add CBE Address'}
        onClose={this.handleClose}
        actions={actions}
        open={this.props.open}>

        <CBEAddressForm ref={i => { this.cbeAddressForm = i }} onSubmit={this.handleSubmit} />

      </ModalBase>
    )
  }
}

CBEAddressModal.propTypes = {
  open: PropTypes.bool,
  hideModal: PropTypes.func,
  save: PropTypes.func
}

export default CBEAddressModal
