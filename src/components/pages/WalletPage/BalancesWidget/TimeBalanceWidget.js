import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Divider, CircularProgress } from 'material-ui'
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance-wallet'
import { updateTimeBalance } from '../../../../redux/wallet/wallet'
import styles from './styles'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  balance: state.get('wallet').time.balance,
  isFetching: state.get('wallet').time.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  updateBalance: (account) => dispatch(updateTimeBalance(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class TimeBalanceWidget extends Component {
  componentWillMount () {
    this.props.updateBalance(this.props.account)
  }

  render () {
    return (
      <Paper style={styles.paper} zDepth={1}>
        <div style={{...styles.blockTop, backgroundColor: '#4a8fb9'}}>
          <AccountBalanceIcon style={styles.icon}/>
          <span style={styles.currency}>TIME</span>
        </div>
        <Divider style={styles.divider}/>
        <div style={styles.block}>
          {this.props.isFetching
            ? <CircularProgress size={24} thickness={1.5}/>
            : <span style={styles.value}>{this.props.balance / 100}</span>}
        </div>
      </Paper>
    )
  }
}

export default TimeBalanceWidget
