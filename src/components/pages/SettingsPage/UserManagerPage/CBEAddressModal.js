import React, { Component } from 'react'
import { connect } from 'react-redux'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import { Dialog, FlatButton, RaisedButton } from 'material-ui'
import CBEAddressForm from './CBEAddressForm'
import CBEModel from '../../../../models/CBEModel'
import { saveCBE } from '../../../../redux/settings/userManager/cbe'
import styles from '../../../modals/styles'

const mapDispatchToProps = (dispatch) => ({
  save: (cbe: CBEModel) => dispatch(saveCBE(cbe, true))
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
    this.refs.CBEAddressForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open} = this.props
    const actions = [
      <FlatButton
        label='Cancel'
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={'Add Address'}
        primary
        onTouchTap={this.handleSubmitClick}
      />
    ]

    return (
      <Dialog
        title={<div>
          Add CBE Address
          <IconButton style={styles.close} onTouchTap={this.handleClose}>
            <NavigationClose />
          </IconButton>
        </div>}
        actions={actions}
        actionsContainerStyle={styles.container}
        titleStyle={styles.title}
        modal
        open={open}>

        <CBEAddressForm ref='CBEAddressForm' onSubmit={this.handleSubmit} />

      </Dialog>
    )
  }
}

export default CBEAddressModal
