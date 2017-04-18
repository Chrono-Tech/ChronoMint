import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Dialog, FlatButton, RaisedButton } from 'material-ui'
import RequiredSignaturesForm from '../forms/operations/RequiredSignaturesForm'
import { setRequiredSignatures } from '../../redux/pendings/actions'
import globalStyles from '../../styles'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

const mapDispatchToProps = (dispatch) => ({
  setRequiredSignatures: (required, account) => dispatch(setRequiredSignatures(required, account))
})

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  operationsProps: state.get('operationsProps')
})

@connect(mapStateToProps, mapDispatchToProps)
class ChangeNumberSignaturesModal extends Component {
  handleSubmit = (values) => {
    const numberOfSignatures = +values.get('numberOfSignatures')
    return this.props.setRequiredSignatures(numberOfSignatures, this.props.account)
  }

  handleSubmitClick = () => {
    this.refs.ChangeNumberSignaturesForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open, pristine, submitting} = this.props
    const actions = [
      <FlatButton
        label='CANCEL'
        style={globalStyles.flatButton}
        labelStyle={globalStyles.flatButtonLabel}
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={'SAVE'}
        buttonStyle={globalStyles.raisedButton}
        labelStyle={globalStyles.raisedButtonLabel}
        primary
        onTouchTap={this.handleSubmitClick.bind(this)}
        disabled={pristine || submitting}
      />
    ]

    return (
      <Dialog
        title={<div>
          Change Number of Required Signatures
          <IconButton style={{float: 'right', margin: '-12px -12px 0px'}} onTouchTap={this.handleClose}>
            <NavigationClose />
          </IconButton>
        </div>}
        actions={actions}
        actionsContainerStyle={{padding: 26}}
        titleStyle={{paddingBottom: 10}}
        modal
        open={open}>
        <div style={globalStyles.modalGreyText}>
          This operation must be co-signed by other CBE key holders before it is executed.
        </div>
        <RequiredSignaturesForm ref='ChangeNumberSignaturesForm' onSubmit={this.handleSubmit}/>
      </Dialog>
    )
  }
}

export default ChangeNumberSignaturesModal
