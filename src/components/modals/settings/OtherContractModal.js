import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatButton, RaisedButton } from 'material-ui'
import OtherContractForm from '../../../components/forms/settings/OtherContractForm'
import ContractsManagerDAO from '../../../dao/ContractsManagerDAO'
import { addContract } from '../../../redux/settings/otherContracts'
import ModalBase from '../ModalBase/ModalBase'

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

    const types = ContractsManagerDAO.getOtherDAOsTypes()
    let typesNames = []
    for (let key in types) {
      if (types.hasOwnProperty(key)) {
        typesNames.push(ContractsManagerDAO.getDAOs()[types[key]].getTypeName())
      }
    }

    return (
      <ModalBase
        title='otherContract.add'
        onClose={this.handleClose}
        actions={actions}
        open={this.props.open}>

        Available types: <b>{typesNames.join(', ')}</b>

        <OtherContractForm ref='OtherContractForm' onSubmit={this.handleSubmit} />

      </ModalBase>
    )
  }
}

export default OtherContractModal
