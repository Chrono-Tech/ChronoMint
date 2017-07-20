// TODO new exchange
/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form/immutable'
import { SelectField, TextField } from 'redux-form-material-ui'
import { MenuItem, RaisedButton, Toggle } from 'material-ui'
import validate from './ExchangeFormValidate'
import { Translate } from 'react-redux-i18n'

const styles = {
  btn: {
    marginTop: 32
  },
  toggle: {
    marginTop: 20,
    marginBottom: 10
  }
}

const mapStateToProps = (state) => {
  const exchange = state.get('exchange')
  const wallet = state.get('wallet')
  return {
    account: state.get('session').account,
    platformBalances: {
      ETH: exchange.eth.balance,
      LHT: exchange.lht.balance
    },
    accountBalances: {
      TIME: wallet.time.balance,
      LHT: wallet.lht.balance,
      ETH: wallet.eth.balance
    },
    rates: exchange.rates.rates,
    initialValues: {
      account: state.get('session').account,
      currency: state.get('exchange').rates.rates.first().symbol(),
      buy: true
    }
  }
}

const renderToggleField = ({input, label, hint, meta: {touched, error}, ...custom}) => (
  <Toggle
    label={input.value ? <Translate value='terms.buying' /> : <Translate value='terms.selling' />}
    onToggle={() => input.onChange(!input.value)}
    toggled={input.value} />
)

@connect(mapStateToProps, null)
@reduxForm({form: 'sendForm', validate})
class ExchangeForm extends Component {
  render () {
    const {handleSubmit, rates, valid} = this.props

    return (
      <form onSubmit={handleSubmit} ref='form'>
        <div className='row'>
          <div className='col-xs-12'>
            <Field
              name='account'
              style={{width: '100%'}}
              component={TextField}
              floatingLabelFixed
              disabled
              fullWidth
              floatingLabelText={<Translate value='terms.account' />} />
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-6'>
            <Field
              name='amount'
              component={TextField}
              floatingLabelFixed
              hintText='0.01'
              fullWidth
              floatingLabelText={<Translate value='terms.amount' />} />
          </div>
          <div className='col-xs-6'>
            <Field
              name='currency'
              component={SelectField}
              fullWidth
              floatingLabelFixed
              floatingLabelText={<Translate value='terms.currency' />}>
              {rates.valueSeq().map(asset => <MenuItem key={asset.symbol()} value={asset.symbol()}
                primaryText={asset.symbol()} />)}
            </Field>
          </div>
        </div>

        <div className='row' style={styles.toggle}>
          <div className='col-xs-12'>
            <Field
              name='buy'
              fullWidth
              component={renderToggleField} />
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-12'>
            <RaisedButton
              label={<Translate value='exchange.exchange' />}
              style={styles.btn}
              primary
              fullWidth
              disabled={!valid}
              type='submit' />
          </div>
        </div>
      </form>
    )
  }
}

export default ExchangeForm
