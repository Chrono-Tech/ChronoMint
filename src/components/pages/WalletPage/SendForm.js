import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form/immutable'
import { connect } from 'react-redux'
import {
  MenuItem,
  RaisedButton,
  SelectField
} from 'material-ui'
import * as validation from '../../forms/validate'
import renderTextField from '../../common/renderTextField'
import LS from '../../../dao/LocalStorageDAO'
import styles from './styles'

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

const renderSelectField = ({input, label, hintText, floatingLabelFixed, meta: {touched, error}, children, ...custom}) => (
  <SelectField
    floatingLabelText={label}
    floatingLabelFixed={floatingLabelFixed}
    errorText={touched && error}
    {...input}
    fullWidth
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom} />
)

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
  validate: (values, props) => {
    const errors = {}
    const recipient = values.get('recipient')
    const amount = values.get('amount')

    errors.amount = validation.required(amount)
    errors.recipient = validation.required(recipient)

    errors.recipient = validation.address(recipient)
    if (recipient === LS.getAccount()) {
      errors.recipient = 'Can\'t send to yourself'
    }
    const currencyId = values.get('currency')
    const balance = props.balances[currencyId]
    if (balance === 0) {
      errors.amount = 'No tokens.'
    } else if (balance - amount < 0) {
      errors.amount = `Not enouth tokens.`
    }
    return errors
  }
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
          <div className='col-sm-12'>
            <Field
              name='recipient'
              component={renderTextField} style={{width: '100%'}}
              floatingLabelText='Recipient address' />
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-6'>
            <Field
              name='amount'
              component={renderTextField}
              floatingLabelFixed
              hintText='0.00'
              floatingLabelText='Amount' />
          </div>
          <div className='col-sm-6'>
            <Field
              name='currency'
              component={renderSelectField}
              floatingLabelText='Currency'>
              {currencies.map(c => <MenuItem key={c.id} value={c.id} primaryText={c.name} />)}
            </Field>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div style={{marginTop: '16px'}}>
              <span style={styles.label}>LHT Fee:</span>
              <span style={styles.value}>1%</span>
            </div>
          </div>
          <div className='col-sm-6'>
            <RaisedButton
              label='Send'
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
