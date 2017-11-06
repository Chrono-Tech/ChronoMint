import { connect } from 'react-redux'
import { ExchangeWidget, ExchangesTable } from 'components'
import { Paper } from 'material-ui'
import React, { Component } from 'react'
import {
  getExchange,
  getExchangesForSymbol,
  getAssetSymbols,
  getExchangesForOwner,
  getExchangeData,
  createExchange,
} from 'redux/exchange/actions'

import './ExchangeContent.scss'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    getExchange: () => dispatch(getExchange()),
    getExchangesForSymbol: (symbol: string) => dispatch(getExchangesForSymbol(symbol)),
    getAssetSymbols: () => dispatch(getAssetSymbols()),
    createExchange: (values) => dispatch(createExchange(values)),
    getExchangesForOwner: (owner: string) => dispatch(getExchangesForOwner(owner)),
    getExchangeData: (exchanges: Array<string>) => dispatch(getExchangeData(exchanges)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ExchangeContent extends Component {
  componentDidMount () {
    this.props.getExchange()
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <div className='ExchangeContent__grid'>
              <div className='row'>
                <div className='col-xs-6'>
                  <div styleName='exchangeBox'>
                    <Paper>
                      <button onClick={() => this.props.getExchangesForSymbol('LHT')}>getExchangesForSymbol</button>
                      <button onClick={() => this.props.createExchange({
                        symbol: 'LHT',
                        useTicker: false,
                        sellPrice: 1,
                        buyPrice: 2,
                      })}
                      >createExchange
                      </button>
                      <ExchangeWidget />
                      <ExchangesTable />
                    </Paper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
