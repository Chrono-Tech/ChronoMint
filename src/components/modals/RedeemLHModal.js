import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Dialog, FlatButton, RaisedButton, CircularProgress } from 'material-ui'
import RedeemLHForm from '../forms/RedeemLHForm'
import { redeemLH } from '../../redux/locs/actions'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

const mapStateToProps = state => ({
  account: state.get('session').account,
  isRedeeming: state.getIn(['locs', state.get('loc').getAddress()]).isRedeeming()
})

const mapDispatchToProps = (dispatch) => ({
  redeemLH: (params) => dispatch(redeemLH(params))
})

@connect(mapStateToProps, mapDispatchToProps)
class RedeemLHModal extends Component {
  handleSubmit = (values) => {
    const redeemAmount = +values.get('redeemAmount')
    const account = this.props.account
    const address = values.get('address')
    return this.props.redeemLH({account, redeemAmount, address})
  }

  handleSubmitClick = () => {
    this.refs.RedeemLHForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open, pristine, isRedeeming} = this.props
    const actions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={'REDEEM LHT'}
        primary
        onTouchTap={this.handleSubmitClick.bind(this)}
        disabled={pristine || isRedeeming}
      />
    ]

    return (
      <Dialog
        title={<div>
          Redeem LH
          <IconButton style={{float: 'right', margin: '-12px -12px 0px'}} onTouchTap={this.handleClose}>
            <NavigationClose />
          </IconButton>
        </div>}
        actions={actions}
        actionsContainerStyle={{padding: 26}}
        titleStyle={{paddingBottom: 10}}
        modal
        open={open}>
        <RedeemLHForm ref='RedeemLHForm' onSubmit={this.handleSubmit} />
        {isRedeeming
          ? <CircularProgress size={24} thickness={1.5} style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)'
          }} />
          : null}
      </Dialog>
    )
  }
}

export default RedeemLHModal
