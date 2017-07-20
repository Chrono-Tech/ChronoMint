import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ExchangeWidget,
  RatesWidget,
  ExchangeTransactions
} from '../components/pages/ExchangePage'
import globalStyles from '../styles'
import { Translate } from 'react-redux-i18n'
import ExchangeBalances from '../components/pages/ExchangePage/ExchangeBalances'
import { updateExchangeETHBalance, updateExchangeLHTBalance } from '../redux/exchange/actions'
import { updateLHTBalance, updateETHBalance } from '../redux/wallet/actions'

const mapDispatchToProps = (dispatch) => ({
  updateExchangeLHTBalance: () => dispatch(updateExchangeLHTBalance()),
  updateExchangeETHBalance: () => dispatch(updateExchangeETHBalance()),
  updateLHTBalance: () => dispatch(updateLHTBalance()),
  updateETHBalance: () => dispatch(updateETHBalance())
})

@connect(null, mapDispatchToProps)
class ExchangePage extends Component {
  componentWillMount () {
    this.props.updateExchangeLHTBalance()
    this.props.updateExchangeETHBalance()
    this.props.updateLHTBalance()
    this.props.updateETHBalance()
  }

  render () {
    return (
      <div>
        <span style={globalStyles.navigation}>ChronoMint / <Translate value='nav.exchange' /></span>
        <div className='row'>
          <div className='col-xs-12 col-md-6' style={{marginBottom: 10}}>
            <ExchangeWidget />
          </div>
          <div className='col-xs-12 col-md-6' style={{marginBottom: 10}}>
            <RatesWidget />
            <div style={{marginTop: 10}}>
              <ExchangeBalances style={{marginTop: 10}} />
            </div>
          </div>
        </div>
        <div className='row' style={{marginTop: 10}}>
          <div className='col-xs'>
            <ExchangeTransactions />
          </div>
        </div>
      </div>
    )
  }
}

ExchangePage.propTypes = {
  updateExchangeLHTBalance: PropTypes.func,
  updateExchangeETHBalance: PropTypes.func,
  updateLHTBalance: PropTypes.func,
  updateETHBalance: PropTypes.func
}

export default ExchangePage
