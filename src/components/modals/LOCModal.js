import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Dialog, FlatButton, RaisedButton, CircularProgress } from 'material-ui'
import LOCForm from '../forms/LOCForm'
import { submitLOC, removeLOC } from '../../redux/locs/locForm/actions'
import globalStyles from '../../styles'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import LOCModel from '../../models/LOCModel'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  isSubmitting: state.getIn(['locs', state.get('loc').getAddress(), 'isSubmitting']) || state.get('loc').isSubmitting()
})

const mapDispatchToProps = (dispatch) => ({
  submitLOC: (loc, account) => dispatch(submitLOC(loc, account)),
  removeLOC: (address) => dispatch(removeLOC(address))
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCModal extends Component {
  handleSubmit = (values) => {
    let jsValues = values.toJS()
    const loc = new LOCModel({...jsValues, expDate: jsValues.expDate.getTime()})
    return this.props.submitLOC(loc, this.props.account)
  }

  handleSubmitClick = () => {
    this.refs.LOCForm.getWrappedInstance().submit()
  }

  handleDeleteClick = () => {
    let address = this.refs.LOCForm.getWrappedInstance().values.get('address')
    this.props.removeLOC(address)
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open, locExists, pristine, isSubmitting} = this.props
    const actions = [
      locExists ? <FlatButton
        label='Delete LOC'
        style={{float: 'left'}}
        onTouchTap={this.handleDeleteClick.bind(this)}
      /> : '',
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={locExists ? 'Save changes' : 'Create LOC'}
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
