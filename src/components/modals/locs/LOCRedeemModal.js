// TODO MINT-266 New LOC
/* eslint-disable */
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { FlatButton, RaisedButton } from 'material-ui'
import LOCRedeemForm, { LOC_REDEEM_FORM_NAME} from '../../forms/LOCRedeemForm/LOCRedeemForm'
import { revokeAsset } from '../../../redux/locs/actions'
import ModalBase from '../ModalBase/ModalBase'
import { Translate } from 'react-redux-i18n'
import { isPristine, submit } from 'redux-form/immutable'
import LOCModel from '../../../models/LOCModel'

const mapStateToProps = state => ({
  isPristine: isPristine(LOC_REDEEM_FORM_NAME)(state)
})

const mapDispatchToProps = (dispatch) => ({
  revokeAsset: (amount: number, loc: LOCModel) => dispatch(revokeAsset(amount, loc)),
  submitForm: () => dispatch(submit(LOC_REDEEM_FORM_NAME))
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCRedeemModal extends Component {
  handleSubmitClick = () => {
    this.props.submitForm()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  handleSubmitSuccess = (amount: number) => {
    this.handleClose()
    this.props.revokeAsset(amount, this.props.loc)
  }

  render () {
    const actions = [
      <FlatButton
        label={<Translate value='terms.cancel' />}
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={<Translate value='locs.redeemS' asset={this.props.loc.currencyString()} />}
        primary
        onTouchTap={this.handleSubmitClick}
        disabled={this.props.isPristine}
      />
    ]

    return (
      <ModalBase
        title='locs.redeemLHT'
        onClose={this.handleClose}
        actions={actions}
        open={this.props.open}>

        <LOCRedeemForm
          loc={this.props.loc}
          onSubmitSuccess={this.handleSubmitSuccess}
        />

      </ModalBase>
    )
  }
}

export default LOCRedeemModal
