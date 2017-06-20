import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { Paper, Divider, CircularProgress } from 'material-ui'
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance-wallet'

function round2decimal (value) {
  return Math.round(value * 100) / 100
}

export const renderBalanceWidget = (token) => {
  return (
    <BalanceWidget
      color='#4a8fb9'
      currency={token.symbol()}
      value={round2decimal(token.balance())}
      isFetching={token.isFetching()}
    />
  )
}

class BalanceWidget extends Component {
  render () {
    return (
      <Paper style={{...styles.paper, marginBottom: '20px'}} zDepth={1}>
        <div style={{...styles.blockTop, backgroundColor: this.props.color}}>
          <AccountBalanceIcon className='xs-hide' style={styles.icon} />
          <span style={styles.currency}>{this.props.currency}</span>
        </div>
        <Divider style={styles.divider} />
        <div style={styles.block}>
          {this.props.isFetching
            ? <CircularProgress size={24} thickness={1.5} />
            : <span style={styles.value}>{this.props.value}</span>}
        </div>
      </Paper>
    )
  }
}

BalanceWidget.propTypes = {
  currency: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.number,
  isFetching: PropTypes.bool
}

// noinspection JSUnusedGlobalSymbols
export default BalanceWidget
