import React, {Component} from 'react'
import {
  SendWidget,
  BalancesWidget,
  WalletTransactions
} from '../components/pages/WalletPage'
import globalStyles from '../styles'
import { Translate } from 'react-redux-i18n'

class WalletPage extends Component {
  render () {
    return (
      <div>
        <span style={globalStyles.navigation}>ChronoMint / <Translate value='nav.wallet' /></span>
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
