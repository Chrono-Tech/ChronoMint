import { Paper, Divider, CircularProgress } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { exchangeCurrency } from 'redux/exchange/actions'

import ExchangeForm from './ExchangeForm'
import globalStyles from '../../../styles'

const mapStateToProps = (state) => {
  const exchange = state.get('exchange')
  const wallet = state.get('mainWallet')
  return {
    isFetched: exchange.rates.isFetched && exchange.eth.isFetched && exchange.lht.isFetched && wallet.tokens().get('ETH').isFetched() && wallet.tokens().get('LHT').isFetched(),
    rates: exchange.rates.rates,
  }
}

const mapDispatchToProps = (dispatch) => ({
  exchangeCurrency: (operation, amount, currency) => dispatch(exchangeCurrency(operation, amount, currency)),
})

@connect(mapStateToProps, mapDispatchToProps)
class ExchangeWidget extends PureComponent {
  static propTypes = {
    exchangeCurrency: PropTypes.func,
    rates: PropTypes.object,
    isFetched: PropTypes.bool,
  }

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
        <Divider style={{ backgroundColor: globalStyles.title.color }} />

        {!this.props.isFetched
          ? (
            <div style={{ textAlign: 'center', height: 270, position: 'relative' }}>
              <CircularProgress
                style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}
                thickness={2.5}
              />
            </div>
          ) : <ExchangeForm onSubmit={this.handleSubmit} />
        }
      </Paper>
    )
  }
}

export default ExchangeWidget
