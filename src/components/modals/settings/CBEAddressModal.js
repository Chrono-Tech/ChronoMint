import React, { Component } from 'react'
import { connect } from 'react-redux'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import { Dialog, FlatButton, RaisedButton } from 'material-ui'
import CBEAddressForm from '../../../components/forms/settings/CBEAddressForm'
import CBEModel from '../../../models/CBEModel'
import { saveCBE } from '../../../redux/settings/userManager/cbe'
import styles from '../styles'

const mapStateToProps = (state) => ({
  modifyAddress: state.get('settingsUserCBE').selected.address()
})

const mapDispatchToProps = (dispatch) => ({
  treat: (cbe: CBEModel, add: boolean) => dispatch(saveCBE(cbe, add))
})

@connect(mapStateToProps, mapDispatchToProps)
class CBEAddressModal extends Component {
  handleSubmit = (values) => {
    this.props.treat(new CBEModel({
      address: this.props.modifyAddress !== null ? this.props.modifyAddress : values.get('address'),
      name: values.get('name')
    }), this.props.modifyAddress === null)
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
        label={(this.props.modifyAddress !== null ? 'Modify' : 'Add') + ' Address'}
        primary
        onTouchTap={this.handleSubmitClick}
      />
    ]

    return (
      <Dialog
        title={<div>
          {this.props.modifyAddress !== null ? 'Modify' : 'Add'} CBE Address
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
