import React, { Component } from 'react'
import {
  SendWidget,
  WalletBalances,
  WalletTransactions
} from '../components/pages/WalletPage'
import globalStyles from '../styles'
import { Translate } from 'react-redux-i18n'

class WalletPage extends Component {
  render () {
    return (
      <div>
        <span style={globalStyles.navigation}>ChronoMint / <Translate value='nav.wallet'/></span>
        <div className='row'>
          <div className='col-xs-12 col-md-6' style={{marginBottom: 10}}>
            <SendWidget />
          </div>
          <div className='col-xs-12 col-md-6' style={{marginBottom: 10}}>
            <WalletBalances />
          </div>
        </div>
        <div className='row' style={{marginTop: 10}}>
          <div className="col-xs">
            <WalletTransactions />
          </div>
        </div>
      </div>
    )
  }
}

export default WalletPage
