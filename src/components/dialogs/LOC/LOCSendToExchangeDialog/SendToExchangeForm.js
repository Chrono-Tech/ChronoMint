// TODO @dkchv: not finished, blocked by exchange rework
/* eslint-disable */
import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { updateCMLHTBalance } from '../../../../redux/wallet/actions'
import { TextField } from 'redux-form-material-ui'
import validate from './validate'
import { RaisedButton } from 'material-ui'
import { Translate } from 'react-redux-i18n'
import './SendToExchangeForm.scss'

const mapStateToProps = state => ({
  contractsManagerBalance: state.get('wallet').contractsManagerLHT.balance
})

const onSubmit = (values) => {
  return +values.get('sendAmount')
}

@connect(mapStateToProps, null)
@reduxForm({form: 'SendToExchangeForm', validate, onSubmit})
class SendToExchangeForm extends Component {
  render () {
    const {handleSubmit, contractsManagerBalance, pristine} = this.props
    return (
      <form onSubmit={handleSubmit} name='SendToExchangeFormName' styleName='root'>

        <div styleName='subHeader'>
          <p><Translate value='forms.mustBeCoSigned' /></p>
          <p><Translate value='forms.correspondingFee' /></p>
          <p>Allowed to send: {contractsManagerBalance} LHT</p>
        </div>

        <Field
          component={TextField}
          name='sendAmount'
          type='number'
          floatingLabelText='Amount to send'
        />

        <div styleName='footer'>
          <RaisedButton
            label={<Translate value='sendS' s='LHT' />}
            primary
            onTouchTap={this.handleSubmitClick.bind(this)}
            disabled={pristine}
          />
        </div>

      </form>
    )
  }
}

export default SendToExchangeForm
