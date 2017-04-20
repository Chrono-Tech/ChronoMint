import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Divider, CircularProgress } from 'material-ui'
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance-wallet'
import { updateTIMEBalance } from '../../../../redux/wallet/actions'
import styles from './styles'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  balance: Math.round(state.get('wallet').time.balance * 100) / 100, // TODO get correct decimals from contract, not here
  isFetching: state.get('wallet').time.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  updateBalance: (account) => dispatch(updateTIMEBalance(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class TIMEBalanceWidget extends Component {
  componentWillMount () {
    this.props.updateBalance(this.props.account)
  }

  render () {
    return (
      <Paper style={styles.paper} zDepth={1}>
        <div style={{...styles.blockTop, backgroundColor: '#4a8fb9'}}>
          <AccountBalanceIcon style={styles.icon} />
          <span style={styles.currency}>TIME</span>
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

export default TIMEBalanceWidget
