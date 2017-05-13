import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form/immutable'
import { connect } from 'react-redux'
import {
  MenuItem,
  RaisedButton
} from 'material-ui'
import { SelectField } from 'redux-form-material-ui'
import renderTextField from '../../common/renderTextField'
import styles from '../../pages/WalletPage/styles'
import validate from './validate'

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
          <div className='col-sm-12'>
            <Field
              name='recipient'
              component={renderTextField} style={{width: '100%'}}
              floatingLabelText='Recipient address'/>
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-6'>
            <Field
              name='amount'
              component={renderTextField}
              floatingLabelFixed
              hintText='0.00'
              floatingLabelText='Amount'/>
          </div>
          <div className='col-sm-6'>
            <Field
              name='currency'
              component={SelectField}
              floatingLabelText='Currency'>
              {currencies.map(c => <MenuItem key={c.id} value={c.id} primaryText={c.name}/>)}
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
              type='submit'/>
          </div>
        </div>
      </form>
    )
  }
}

export default SendForm
