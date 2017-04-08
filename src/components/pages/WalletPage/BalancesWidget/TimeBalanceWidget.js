import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Paper, Divider, CircularProgress} from 'material-ui'
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance-wallet'
import globalStyles from '../../../../styles'
import {updateTimeBalance} from '../../../../redux/wallet/wallet'

const styles = {
  paper: {
    width: '100%',
    height: 100
  },
  block: {
    padding: '12px 14px 13px 14px'
  },
  blockTop: {
    padding: '12px 14px 13px 14px',
    backgroundColor: '#4a8fb9'
  },
  icon: {
    color: '#fff',
    verticalAlign: 'top'
  },
  currencies: {
    marginTop: 24
  },
  currency: {
    float: 'right',
    color: '#fff',
    fontSize: 16,
    fontWeight: 400
  },
  value: {
    float: 'right',
    fontSize: 16,
    fontWeight: 500
  },
  divider: {
    backgroundColor: globalStyles.title.color
  }
}

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
        <div style={styles.blockTop}>
          <AccountBalanceIcon style={styles.icon} />
          <span style={styles.currency}>TIME</span>
        </div>
        <Divider style={styles.divider} />
        <div style={styles.block}>
          {
            this.props.isFetching
              ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}} />
              : <span style={styles.value}>{this.props.balance / 100}</span>
          }
        </div>
      </Paper>
    )
  }
}

export default TimeBalanceWidget
