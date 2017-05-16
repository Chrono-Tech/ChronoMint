import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { Paper, Divider, CircularProgress } from 'material-ui'
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance-wallet'
import globalStyles from '../../../styles'

function round2decimal (value) {
  return Math.round(value * 100) / 100
}

export const renderBalanceWidget = (token) => {
  return (
    <BalanceWidget
      color={globalStyles.colors[token.id]}
      currency={token.currencyId}
      value={round2decimal(token.balance)}
      isFetching={token.isFetching}
    />
  )
}

class BalanceWidget extends Component {
  render () {
    return (
      <Paper style={styles.paper} zDepth={1}>
        <div style={{...styles.blockTop, backgroundColor: this.props.color}}>
          <AccountBalanceIcon style={styles.icon} />
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

BalanceWidget.propType = {
  currency: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.number,
  isFetching: PropTypes.bool
}

export default BalanceWidget
