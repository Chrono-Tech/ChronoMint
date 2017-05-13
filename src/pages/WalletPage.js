import React, {Component} from 'react'
import {
  SendWidget,
  BalancesWidget,
  WalletTransactions
} from '../components/pages/WalletPage'
import globalStyles from '../styles'

class WalletPage extends Component {
  render () {
    return (
      <div>
        <span style={globalStyles.navigation}>ChronoMint / Wallet</span>
        <div className='row'>
          <div className='col-sm-6'>
            <SendWidget />
          </div>
          <div className='col-sm-6'>
            <BalancesWidget />
          </div>
        </div>
        <div className='row' style={{marginTop: 20}}>
          <div className='col-sm-12'>
            <WalletTransactions />
          </div>
        </div>
      </div>
    )
  }
}

export default WalletPage
