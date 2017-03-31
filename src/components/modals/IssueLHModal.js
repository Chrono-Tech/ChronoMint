import {connect} from 'react-redux'
import React, {Component} from 'react'
import {Dialog, FlatButton, RaisedButton} from 'material-ui'
import IssueLHForm from '../forms/IssueLH/IssueLHForm'
import {issueLH} from '../../redux/locs/actions'
import globalStyles from '../../styles'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

const mapStateToProps = state => {
  const initialLOC = state.get('loc').toJS()
  return ({initialLOC})
}

const mapDispatchToProps = (dispatch) => ({
  issueLH: (params, hideModal) => dispatch(issueLH(params, hideModal))
})

@connect(mapStateToProps, mapDispatchToProps)
class IssueLHModal extends Component {
  handleSubmit = (values) => {
    let oldIssued = this.props.initialLOC.issued
    const issueAmount = +values.get('issueAmount')
    let issued = oldIssued + issueAmount
    let account = window.localStorage.getItem('chronoBankAccount')
    let address = values.get('address')
    this.props.issueLH({account, issueAmount, address, issued}, this.props.hideModal)
  };

  handleSubmitClick = () => {
    this.refs.IssueLHForm.getWrappedInstance().submit()
  };

  handleClose = () => {
    this.props.hideModal()
  };

  render () {
    const {open, pristine, submitting} = this.props
    const actions = [
      <FlatButton
        label='Cancel'
        style={globalStyles.flatButton}
        labelStyle={globalStyles.flatButtonLabel}
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={'ISSUE LHUS'}
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
          Issue LH
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
        <IssueLHForm ref='IssueLHForm' onSubmit={this.handleSubmit} />
      </Dialog>
    )
  }
}

export default IssueLHModal
