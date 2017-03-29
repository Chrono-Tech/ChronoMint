import {connect} from 'react-redux'
import React, {Component} from 'react'
import {Dialog, FlatButton, RaisedButton} from 'material-ui'
import LOCForm from '../forms/LOCForm/LOCForm'
import {submitLOC, removeLOC} from '../../redux/locs/actions'
import globalStyles from '../../styles'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

const mapDispatchToProps = (dispatch) => ({
  submitLOC: (params, hideModal) => dispatch(submitLOC(params, hideModal)),
  removeLOC: (address, account, hideModal) => dispatch(removeLOC(address, account, hideModal))
})

@connect(null, mapDispatchToProps)
class LOCModal extends Component {
  handleSubmit = (values) => {
    const account = window.localStorage.getItem('chronoBankAccount')
    let jsValues = values.toJS()
    jsValues = {...jsValues, expDate: jsValues.expDate.getTime()}
    this.props.submitLOC({...jsValues, account}, this.props.hideModal)
  };

  handleSubmitClick = () => {
    this.refs.LOCForm.getWrappedInstance().submit()
  };

  handleDeleteClick = () => {
    const account = window.localStorage.getItem('chronoBankAccount')
    let address = this.refs.LOCForm.getWrappedInstance().values.get('address')
    this.props.removeLOC(address, account, this.props.hideModal)
  };

  handleClose = () => {
    this.props.hideModal()
  };

  render () {
    const {open, locExists, pristine, submitting} = this.props
    const actions = [
      locExists ? <FlatButton
        label='Delete LOC'
        style={{...globalStyles.flatButton, float: 'left'}}
        labelStyle={globalStyles.flatButtonLabel}
        onTouchTap={this.handleDeleteClick.bind(this)}
      /> : '',
      <FlatButton
        label='Cancel'
        style={globalStyles.flatButton}
        labelStyle={globalStyles.flatButtonLabel}
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={locExists ? 'Save changes' : 'Create LOC'}
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
          {locExists ? 'Edit LOC' : 'New LOC'}
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
        <LOCForm ref='LOCForm' onSubmit={this.handleSubmit} />
      </Dialog>
    )
  }
}

export default LOCModal
