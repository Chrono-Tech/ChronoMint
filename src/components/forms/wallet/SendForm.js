import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form/immutable'
import { connect } from 'react-redux'
import {
  MenuItem,
  RaisedButton
} from 'material-ui'
import { SelectField, TextField } from 'redux-form-material-ui'
import styles from '../../pages/WalletPage/styles'
import validate from './validate'
import { Translate } from 'react-redux-i18n'

const currencies = [{
  id: 'eth',
  name: 'ETH'
}, {
  id: 'lht',
  name: 'LHT'
}, {
  id: 'time',
  name: 'TIME'
}]

const mapStateToProps = (state) => {
  const wallet = state.get('wallet')
  const time = wallet.time
  const lht = wallet.lht
  const eth = wallet.eth
  return {
    sendFetching: time.isFetching || lht.isFetching || eth.isFetching,
    initialValues: {
      currency: currencies[0].id
    },
    balances: {
      time: time.balance,
      lht: lht.balance,
      eth: eth.balance
    }
  }
}

@connect(mapStateToProps, null)
@reduxForm({
  form: 'sendForm',
  validate
})
class SendForm extends Component {
  constructor () {
    super()
    this.state = {
      currencies
    }
  }

  render () {
    const {currencies} = this.state
    const {handleSubmit, valid, sendFetching, pristine} = this.props
    const isValid = valid && !sendFetching && !pristine

    return (
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-xs-12'>
            <Field
              name='recipient'
              component={TextField} style={{width: '100%'}}
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
              {currencies.map(c => <MenuItem key={c.id} value={c.id} primaryText={c.name} />)}
            </Field>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-6'>
            <div style={{marginTop: '16px'}}>
              <span style={styles.label}>LHT <Translate value='terms.fee' />:</span>
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
