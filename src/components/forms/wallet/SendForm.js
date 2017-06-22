import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { MenuItem, RaisedButton } from 'material-ui'
import TokenModel from '../../../models/TokenModel'
import { SelectField, TextField } from 'redux-form-material-ui'
import styles from '../../pages/WalletPage/styles'
import validate from './validate'
import { Translate } from 'react-redux-i18n'

export const SEND_FORM_NAME = 'sendForm'

const mapStateToProps = (state) => {
  const tokens = state.get('wallet').tokens

  let sendFetching = false
  for (let token: TokenModel of tokens.valueSeq().toArray()) {
    sendFetching |= token.isFetching()
  }

  return {
    tokens,
    sendFetching,
    initialValues: {
      currency: 'ETH'
    }
  }
}

@connect(mapStateToProps, null)
@reduxForm({form: SEND_FORM_NAME, validate})
class SendForm extends Component {
  render () {
    const {tokens, handleSubmit, valid, sendFetching, pristine} = this.props
    const isValid = valid && !sendFetching && !pristine

    return (
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-xs-12'>
            <Field
              name='recipient'
              component={TextField}
              style={{width: '100%'}}
              fullWidth
              floatingLabelText={<Translate value='wallet.recipientAddress' />} />
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-6'>
            <Field
              name='amount'
              component={TextField}
              floatingLabelFixed
              hintText='0.00'
              fullWidth
              floatingLabelText={<Translate value='terms.amount' />} />
          </div>
          <div className='col-xs-6'>
            <Field
              name='currency'
              component={SelectField}
              fullWidth
              floatingLabelText={<Translate value='terms.currency' />}>
              {tokens.valueSeq().map((t: TokenModel) => {
                return <MenuItem key={t.symbol()} value={t.symbol()} primaryText={t.symbol()} />
              })}
            </Field>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-6'>
            <div style={{marginTop: '16px'}}>
              <span style={styles.label}><Translate value='terms.fee' />:</span>
              <span style={styles.value}>1%</span>
            </div>
          </div>
          <div className='col-xs-6'>
            <RaisedButton
              label={<Translate value='terms.send' />}
              style={styles.btn}
              primary
              fullWidth
              disabled={!isValid}
              type='submit' />
          </div>
        </div>
      </form>
    )
  }
}

export default SendForm
