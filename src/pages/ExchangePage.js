import React, {Component} from 'react'
import {
  ExchangeWidget,
  RatesWidget,
  ExchangeTransactionsWidget
} from '../components/pages/ExchangePage'
import globalStyles from '../styles'
import { Translate } from 'react-redux-i18n'

class ExchangePage extends Component {
  render () {
    return (
      <div>
        <span style={globalStyles.navigation}>ChronoMint / <Translate value='nav.exchange' /></span>
        <div className='row'>
          <div className='col-sm-6'>
            <ExchangeWidget />
          </div>
          <div className='col-sm-6'>
            <RatesWidget />
            <div style={{marginTop: '10px'}} />
          </div>
        </div>
        <div className='row' style={{marginTop: 20}}>
          <div className='col-sm-12'>
            <ExchangeTransactionsWidget />
          </div>
        </div>
      </div>
    )
  }
}

export default ExchangePage
