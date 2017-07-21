// TODO MINT-266 New LOC
/* eslint-disable */
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { FlatButton, RaisedButton } from 'material-ui'
import LOCStatusForm, { LOC_STATUS_FORM_NAME } from '../../forms/LOCStatusForm/LOCStatusForm'
import { updateStatus } from '../../../redux/locs/actions'
import ModalBase from '../ModalBase/ModalBase'
import { isPristine, submit } from 'redux-form/immutable'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = state => ({
  isPristine: isPristine(LOC_STATUS_FORM_NAME)(state)
})

const mapDispatchToProps = (dispatch) => ({
  updateStatus: (status, loc) => dispatch(updateStatus(status, loc)),
  submitForm: () => dispatch(submit(LOC_STATUS_FORM_NAME))
})

@connect(mapStateToProps, mapDispatchToProps)
class IssueLHModal extends Component {
  handleSubmitClick = () => {
    this.props.submitForm()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  handleSubmitSuccess = (status: number) => {
    this.handleClose()
    this.props.updateStatus(status, this.props.loc)
  }

  render () {
    const {open, isPristine, loc} = this.props
    const actions = [
      <FlatButton
        label={<Translate value='terms.cancel' />}
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={<Translate value='locs.updateStatus' />}
        primary
        onTouchTap={this.handleSubmitClick}
        disabled={isPristine}
      />
    ]

    return (
      <ModalBase
        title='locs.updateStatus'
        onClose={this.handleClose}
        actions={actions}
        open={open}
      >
        <LOCStatusForm
          initialValues={{status: loc.status()}}
          onSubmitSuccess={this.handleSubmitSuccess}
        />

      </ModalBase>
    )
  }
}

export default IssueLHModal
