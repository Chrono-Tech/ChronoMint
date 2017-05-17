import React, { Component } from 'react'
import {
  ExchangeWidget,
  RatesWidget,
  ExchangeTransactions
} from '../components/pages/ExchangePage'
import globalStyles from '../styles'
import { Translate } from 'react-redux-i18n'
import ExchangeBalances from '../components/pages/ExchangePage/ExchangeBalances'

class ExchangePage extends Component {
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

export default ExchangePage
