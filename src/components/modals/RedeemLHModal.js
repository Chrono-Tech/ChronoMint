import {connect} from 'react-redux'
import React, {Component} from 'react'
import {Dialog, FlatButton, RaisedButton} from 'material-ui'
import RedeemLHForm from '../forms/RedeemLHForm/'
import {redeemLH} from '../../redux/locs/actions'
import globalStyles from '../../styles'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

const mapStateToProps = state => ({
  account: state.get('session').account
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
  };

  handleSubmitClick = () => {
    this.refs.RedeemLHForm.getWrappedInstance().submit()
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
        label={'REDEEM LHUS'}
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
      </Dialog>
    )
  }
}

export default RedeemLHModal
