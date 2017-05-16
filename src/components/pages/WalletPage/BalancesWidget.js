import React, { Component } from 'react'
import { Paper, TextField, Divider } from 'material-ui'
import LS from '../../../dao/LocalStorageDAO'

import TIMEBalanceWidget from './BalancesWidget/TIMEBalanceWidget'
import LHTBalanceWidget from './BalancesWidget/LHTBalanceWidget'
import ETHBalanceWidget from './BalancesWidget/ETHBalanceWidget'

import globalStyles from '../../../styles'
import { Translate } from 'react-redux-i18n'

const styles = {
  currencies: {
    marginTop: 24
  }
}

class BalancesWidget extends Component {
  render () {
    const {isCompact} = this.props

    const balances = (
      <div className='row' style={styles.currencies}>
        <div className='col-xs-4'>
          <ETHBalanceWidget />
        </div>
        <div className='col-xs-4'>
          <LHTBalanceWidget />
        </div>
        <div className='col-xs-4'>
          <TIMEBalanceWidget />
        </div>
      </div>
    )

    return isCompact ? balances : (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}><Translate value='terms.balances' /></h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />

        <TextField
          floatingLabelText={<Translate value='terms.account' />}
          fullWidth
          value={LS.getAccount() || ''}
          disabled />
        {balances}
      </Paper>
    )
  }
}

export default BalancesWidget
