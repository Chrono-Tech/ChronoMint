import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import { Dialog, FlatButton, RaisedButton } from 'material-ui'
import OperationsSettingsForm from '../../components/forms/OperationsSettingsForm'
import { setRequiredSignatures } from '../../redux/operations/actions'
import styles from './styles'

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
    const {open} = this.props
    const actions = [
      <FlatButton
        label={<Translate value='nav.cancel' />}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={<Translate value='nav.save' />}
        primary
        onTouchTap={this.handleSubmitClick}
      />
    ]

    return (
      <Dialog
        title={<div>
          <Translate value='operations.settings' />
          <IconButton style={styles.close} onTouchTap={this.handleClose}>
            <NavigationClose />
          </IconButton>
        </div>}
        actions={actions}
        actionsContainerStyle={styles.container}
        titleStyle={styles.title}
        modal
        open={open}>

        <OperationsSettingsForm ref='OperationsSettingsForm' onSubmit={this.handleSubmit} />

      </Dialog>
    )
  }
}

export default OperationsSettingsModal
