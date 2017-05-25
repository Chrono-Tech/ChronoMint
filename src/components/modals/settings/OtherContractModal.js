import React, { Component } from 'react'
import { connect } from 'react-redux'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import { Dialog, FlatButton, RaisedButton } from 'material-ui'
import OtherContractForm from '../../../components/forms/settings/OtherContractForm'
import DAOFactory from '../../../dao/DAOFactory'
import { addContract } from '../../../redux/settings/otherContracts'
import styles from '../styles'

const mapDispatchToProps = (dispatch) => ({
  addContract: (address: string) => dispatch(addContract(address))
})

@connect(null, mapDispatchToProps)
class OtherContractModal extends Component {
  handleSubmit = (values) => {
    this.props.addContract(values.get('address'))
    this.handleClose()
  }

  handleSubmitClick = () => {
    this.refs.OtherContractForm.getWrappedInstance().submit()
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
        label={'Add'}
        primary
        onTouchTap={this.handleSubmitClick.bind(this)}
      />
    ]

    const types = DAOFactory.getOtherDAOsTypes()
    let typesNames = []
    for (let key in types) {
      if (types.hasOwnProperty(key)) {
        typesNames.push(DAOFactory.getDAOs()[types[key]].getTypeName())
      }
    }

    return (
      <Dialog
        title={<div>
          {'Add other contract'}
          <IconButton style={styles.close} onTouchTap={this.handleClose}><NavigationClose /></IconButton>
        </div>}
        actions={actions}
        actionsContainerStyle={styles.container}
        titleStyle={styles.title}
        modal
        open={open}>

        Available types: <b>{typesNames.join(', ')}</b>

        <OtherContractForm ref='OtherContractForm' onSubmit={this.handleSubmit} />

      </Dialog>
    )
  }
}

export default OtherContractModal
