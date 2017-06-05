import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { FlatButton, RaisedButton } from 'material-ui'
import OperationsSettingsForm from '../../components/forms/OperationsSettingsForm'
import { setRequiredSignatures } from '../../redux/operations/actions'
import ModalBase from './ModalBase/ModalBase'

const mapDispatchToProps = (dispatch) => ({
  save: (requiredSigns: number) => dispatch(setRequiredSignatures(requiredSigns))
})

@connect(null, mapDispatchToProps)
class OperationsSettingsModal extends Component {
  handleSubmit = (values) => {
    this.props.save(values.get('requiredSigns'))
    this.handleClose()
  }

  handleSubmitClick = () => {
    this.refs.OperationsSettingsForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const actions = [
      <FlatButton
        label={<Translate value='terms.cancel' />}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={<Translate value='terms.save' />}
        primary
        onTouchTap={this.handleSubmitClick}
      />
    ]

    return (
      <ModalBase
        title='operations.settings'
        onClose={this.handleClose}
        actions={actions}
        open={this.props.open}>

        <OperationsSettingsForm ref='OperationsSettingsForm' onSubmit={this.handleSubmit} />

      </ModalBase>
    )
  }
}

export default OperationsSettingsModal
