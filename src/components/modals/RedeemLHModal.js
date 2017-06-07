import { connect } from 'react-redux'
import React, { Component } from 'react'
import { CircularProgress, FlatButton, RaisedButton } from 'material-ui'
import RedeemLHForm from '../forms/LOCRedeemForm/LOCRedeemForm'
import { redeemLH } from '../../redux/locs/actions'
import ModalBase from './ModalBase/ModalBase'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = state => ({
  isRedeeming: state.getIn(['locs', state.get('loc').getAddress()]).isRedeeming()
})

const mapDispatchToProps = (dispatch) => ({
  redeemLH: (params) => dispatch(redeemLH(params))
})

@connect(mapStateToProps, mapDispatchToProps)
class RedeemLHModal extends Component {
  handleSubmit = (values) => {
    const redeemAmount = +values.get('redeemAmount')
    const address = values.get('address')
    return this.props.redeemLH({redeemAmount, address})
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
        label={<Translate value='cancel' />}
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={<Translate value='locs.redeemLHT' />}
        primary
        onTouchTap={this.handleSubmitClick}
        disabled={pristine || isRedeeming}
      />
    ]

    return (
      <ModalBase
        title='locs.redeemLHT'
        onClose={this.handleClose}
        actions={actions}
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
      </ModalBase>
    )
  }
}

export default RedeemLHModal
