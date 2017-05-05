import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form/immutable'
import {
  Toggle,
  SelectField,
  MenuItem,
  RaisedButton
} from 'material-ui'

import validate from './ExchangeFormValidate'
import renderTextField from '../../common/renderTextField'
import BalancesWidget from '../WalletPage/BalancesWidget'
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

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  exchange: state.get('exchangeData'),
  initialValues: {
    account: state.get('session').account,
    currency: state.get('exchangeData').first().title,
    buy: true
  }
})

const renderToggleField = ({input, label, hint, meta: {touched, error}, ...custom}) => (
  <Toggle label={input.value ? <Translate value='terms.buying' /> : <Translate value='terms.selling' />}
          onToggle={() => input.onChange(!input.value)}
          toggled={input.value}/>

)

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

@connect(mapStateToProps, null)
@reduxForm({form: 'sendForm', validate})
class ExchangeForm extends Component {
  render () {
    const {handleSubmit} = this.props
    return (
      <form onSubmit={handleSubmit} ref='form'>
        <div className='row'>
          <div className='col-sm-12'>
            <Field
              name='account'
              style={{width: '100%'}}
              component={renderTextField}
              floatingLabelFixed
              disabled
              floatingLabelText={<Translate value='terms.account'/>}/>
          </div>
        </div>

        <div className="row">
          <div className='col-sm-12'>
            <BalancesWidget isCompact/>
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-6'>
            <Field
              name='amount'
              component={renderTextField}
              floatingLabelFixed
              hintText='0.01'
              floatingLabelText={<Translate value='terms.amount'/>}/>
          </div>
          <div className='col-sm-6'>
            <Field
              name='currency'
              component={renderSelectField}
              floatingLabelFixed
              floatingLabelText={<Translate value='terms.currency' />}>
              {this.props.exchange.valueSeq().map(asset =>
                <MenuItem key={asset.title} value={asset.title} primaryText={asset.title}/>)}
            </Field>
          </div>
        </div>

        <div className='row' style={styles.toggle}>
          <div className='col-sm-12'>
            <Field
              name='buy'
              component={renderToggleField}/>
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-12'>
            <RaisedButton
              label={<Translate value='exchange.exchange' />}
              style={styles.btn}
              primary
              fullWidth
              type='submit'/>
          </div>
        </div>
      </form>
    )
  }
}

export default ExchangeForm
