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

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  sendFetching: state.get('wallet').time.isFetching || state.get('wallet').lht.isFetching || state.get('wallet').eth.isFetching,
  initialValues: {
    currency: 'ETH'
  }
})

const styles = {
  label: {
    fontWeight: 300
  },
  value: {
    float: 'right',
    fontWeight: 500
  },
  btn: {
    marginTop: 10
  }
}

@connect(mapStateToProps, null)
@reduxForm({
  form: 'sendForm',
  validate: (values) => {
    const errors = {}
    errors.recipient = validation.address(values.get('recipient'))
    if (!values.get('amount') || /[^.]\d{2,}/.test(values.get('amount'))) {
      errors.amount = 'Enter amount with maximum 2 decimal places'
    }
    return errors
  }
})
class SendForm extends Component {
  constructor () {
    super()
    this.state = {
      currencies: ['ETH', 'LHT', 'TIME'],
      selectedCurrency: 'ETH'
    }
  }

  render () {
    const {currencies} = this.state
    const {handleSubmit} = this.props
    return (
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-sm-12'>
            <Field name='recipient'
              component={renderTextField} style={{width: '100%'}}
              floatingLabelText='Recipient address' />
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-6'>
            <Field name='amount'
              component={renderTextField}
              floatingLabelFixed
              hintText='0.0'
              floatingLabelText='Amount' />
          </div>
          <div className='col-sm-6'>
            <Field name='currency'
              component={renderSelectField}
              floatingLabelText='Currency'>
              {currencies.map(c => <MenuItem key={c} value={c} primaryText={c} />)}
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
            <RaisedButton label='Send'
              style={styles.btn}
              primary
              fullWidth
              disabled={this.props.sendFetching}
              type='submit' />
          </div>
        </div>
      </form>
    )
  }
}

export default SendForm
