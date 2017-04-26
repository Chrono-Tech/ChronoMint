import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Divider, CircularProgress } from 'material-ui'
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance-wallet'
import { updateETHBalance } from '../../../../redux/wallet/actions'
import styles from './styles'
import ls from '../../../../utils/localStorage'
import localStorageKeys from '../../../../constants/localStorageKeys'

const mapStateToProps = (state) => ({
  balance: Math.round(state.get('wallet').eth.balance * 100) / 100, // round to 2 decimal places
  isFetching: state.get('wallet').eth.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  updateBalance: () => dispatch(updateETHBalance(ls(localStorageKeys.ACCOUNT)))
})

@connect(mapStateToProps, mapDispatchToProps)
class LHTBalanceWidget extends Component {
  componentWillMount () {
    this.props.updateBalance()
  }

  render () {
    return (
      <Paper style={styles.paper} zDepth={1}>
        <div style={{...styles.blockTop, backgroundColor: '#161240'}}>
          <AccountBalanceIcon style={styles.icon} />
          <span style={styles.currency}>ETH</span>
        </div>
        <Divider style={styles.divider} />
        <div style={styles.block}>
          {this.props.isFetching
            ? <CircularProgress size={24} thickness={1.5} />
            : <span style={styles.value}>{this.props.balance}</span>}
        </div>
      </Paper>
    )
  }
}

export default LHTBalanceWidget
