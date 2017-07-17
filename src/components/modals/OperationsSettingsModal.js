import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { FlatButton, RaisedButton } from 'material-ui'

import OperationsSettingsForm from 'components/forms/OperationsSettingsForm'
import { setRequiredSignatures } from 'redux/operations/actions'
import ModalBase from './ModalBase/ModalBase'

const mapDispatchToProps = (dispatch) => ({
  save: (requiredSigns: number) => dispatch(setRequiredSignatures(requiredSigns))
})

@connect(null, mapDispatchToProps)
class OperationsSettingsModal extends Component {

  static propTypes = {
    save: PropTypes.func,
    hideModal: PropTypes.func,
    open: PropTypes.func
  }

  handleSubmit = (values) => {
    this.props.save(parseInt(values.get('requiredSigns'), 10))
    this.handleClose()
  }

  handleSubmitClick = () => {
    this.settingsForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const actions = [
      <FlatButton
        key='cancel'
        label={<Translate value='terms.cancel' />}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        key='save'
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

        <OperationsSettingsForm ref={i => { this.settingsForm = i }} onSubmit={this.handleSubmit} />

      </ModalBase>
    )
  }
}

export default OperationsSettingsModal
