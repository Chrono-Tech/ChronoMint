import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatButton, RaisedButton } from 'material-ui'
import { saveContractSettings } from '../../../redux/settings/otherContracts'
import AbstractOtherContractModel from '../../../models/contracts/AbstractOtherContractModel'
import ModalBase from '../ModalBase/ModalBase'

const mapStateToProps = (state) => ({
  contract: state.get('settingsOtherContracts').selected /** @see AbstractOtherContractModel **/
})

const mapDispatchToProps = (dispatch) => ({
  save: (contract: AbstractOtherContractModel) =>
    dispatch(saveContractSettings(contract))
})

@connect(mapStateToProps, mapDispatchToProps)
class OtherContractModifyModal extends Component {
  handleSubmit = (values) => {
    this.props.save(this.props.contract.set('settings', values.toJS()))
    this.handleClose()
  }

  handleSubmitClick = () => {
    this.refs.OtherContractModifyForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const form = this.props.contract.form('OtherContractModifyForm', this.handleSubmit)
    const actions = form === null ? [<FlatButton label='Close' onTouchTap={this.handleClose} />]
      : [
        <FlatButton
          label='Cancel'
          onTouchTap={this.handleClose}
        />,
        <RaisedButton
          label={'Save'}
          primary
          onTouchTap={this.handleSubmitClick}
        />
      ]

    return (
      <ModalBase
        title={`Modify ${this.props.contract.name()} contract`}
        onClose={this.handleClose}
        actions={actions}
        open={this.props.open}>

        {form === null ? 'This contract has no settings.' : form}

      </ModalBase>
    )
  }
}

export default OtherContractModifyModal
