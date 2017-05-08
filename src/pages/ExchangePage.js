import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ExchangeWidget,
  RatesWidget,
  ExchangeTransactions
} from '../components/pages/ExchangePage'
import globalStyles from '../styles'
import { Translate } from 'react-redux-i18n'
import { getRates } from '../redux/exchange/exchangeRates'

const mapStateToProps = (state) => ({
  isFetched: state.get('exchangeRates').isFetched
})

const mapDispatchToProps = (dispatch) => ({
  getRates: () => dispatch(getRates())
})

@connect(mapStateToProps, mapDispatchToProps)
class ExchangePage extends Component {
  componentWillMount () {
    if (!this.props.isFetched) {
      this.props.getRates()
    }
  }

  render () {
    return (
      <div>
        <span style={globalStyles.navigation}>ChronoMint / <Translate value='nav.exchange'/></span>
        <div className='row'>
          <div className='col-sm-6'>
            <ExchangeWidget />
          </div>
          <div className='col-sm-6'>
            <RatesWidget />
            <div style={{marginTop: '10px'}}/>
          </div>
        </div>
        <div className='row' style={{marginTop: 20}}>
          <div className='col-sm-12'>
            <ExchangeTransactions />
          </div>
        </div>
      </div>
    )
  }
}

export default ExchangePage
