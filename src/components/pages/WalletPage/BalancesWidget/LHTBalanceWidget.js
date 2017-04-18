import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Divider, CircularProgress } from 'material-ui'
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance-wallet'
import { updateLHTBalance } from '../../../../redux/wallet/actions'
import styles from './styles'

const mapStateToProps = (state) => ({
  balance: state.get('wallet').lht.balance,
  isFetching: state.get('wallet').lht.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  updateBalance: () => dispatch(updateLHTBalance())
})

@connect(mapStateToProps, mapDispatchToProps)
class LHTBalanceWidget extends Component {
  componentWillMount () {
    this.props.updateBalance()
  }

  render () {
    return (
      <Paper style={styles.paper} zDepth={1}>
        <div style={{...styles.blockTop, backgroundColor: '#17579c'}}>
          <AccountBalanceIcon style={styles.icon} />
          <span style={styles.currency}>LHT</span>
        </div>
        <Divider style={styles.divider} />
        <div style={styles.block}>
          {this.props.isFetching
            ? <CircularProgress size={24} thickness={1.5} />
            : <span style={styles.value}>{this.props.balance / 100}</span>}
        </div>
      </Paper>
    )
  }
}

export default LHTBalanceWidget
