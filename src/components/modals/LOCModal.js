import {connect} from 'react-redux'
import React, {Component} from 'react'
import {Dialog, FlatButton, RaisedButton, CircularProgress} from 'material-ui'
import LOCForm from '../forms/LOCForm/LOCForm'
import {submitLOC, removeLOC} from '../../redux/locs/actions'
import globalStyles from '../../styles'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  isSubmitting: state.getIn(['locs', state.get('loc').getAddress(), 'isSubmitting']) || state.get('loc').isSubmitting()
})

const mapDispatchToProps = (dispatch) => ({
  submitLOC: (params) => dispatch(submitLOC(params)),
  removeLOC: (address, account) => dispatch(removeLOC(address, account))
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCModal extends Component {
  handleSubmit = (values) => {
    let jsValues = values.toJS()
    jsValues = {...jsValues, expDate: jsValues.expDate.getTime()}
    this.props.submitLOC({...jsValues, account: this.props.account})
  };

  handleSubmitClick = () => {
    this.refs.LOCForm.getWrappedInstance().submit()
  };

  handleDeleteClick = () => {
    let address = this.refs.LOCForm.getWrappedInstance().values.get('address')
    this.props.removeLOC(address, this.props.account)
  };

  handleClose = () => {
    this.props.hideModal()
  };

  render () {
    const {open, locExists, pristine, isSubmitting} = this.props
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
        disabled={pristine || isSubmitting}
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
        autoScrollBodyContent
        open={open}
        contentStyle={{position: 'relative'}}
      >
        <div style={globalStyles.modalGreyText}>
          This operation must be co-signed by other CBE key holders before it is executed.
        </div>
        <LOCForm ref='LOCForm' onSubmit={this.handleSubmit} />
        {
          isSubmitting
            ? <CircularProgress size={24} thickness={1.5} style={{position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)'}} />
            : null
        }
      </Dialog>
    )
  }
}

export default LOCModal
