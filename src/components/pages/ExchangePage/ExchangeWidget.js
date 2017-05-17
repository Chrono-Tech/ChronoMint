import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Paper,
  Divider,
  CircularProgress
} from 'material-ui'
import ExchangeForm from './ExchangeForm'
import globalStyles from '../../../styles'
import { Translate } from 'react-redux-i18n'
import { exchangeCurrency } from '../../../redux/exchange/actions'

const mapStateToProps = (state) => ({
  isFetched: state.get('exchange').rates.isFetched,
  rates: state.get('exchange').rates.rates
})

const mapDispatchToProps = (dispatch) => ({
  exchangeCurrency: (operation, amount, currency) => dispatch(exchangeCurrency(operation, amount, currency))
})

@connect(mapStateToProps, mapDispatchToProps)
class ExchangeWidget extends Component {
  handleSubmit = (values) => {
    const currency = values.get('currency')
    const operation = values.get('buy')
    const amount = values.get('amount')
    const rates = this.props.rates.get(currency)
    this.props.exchangeCurrency(operation, amount, rates)
  }

  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}><Translate value='exchange.tokens' /></h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />

        {!this.props.isFetched
          ? (
            <div style={{textAlign: 'center', height: 270, position: 'relative'}}>
              <CircularProgress
                style={{position: 'relative', top: '50%', transform: 'translateY(-50%)'}}
                thickness={2.5} />
            </div>
          ) : <ExchangeForm onSubmit={this.handleSubmit} />
        }
      </Paper>
    )
  }
}

export default ExchangeWidget
