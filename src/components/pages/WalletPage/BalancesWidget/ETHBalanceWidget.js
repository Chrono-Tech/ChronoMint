import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Paper, Divider, CircularProgress} from 'material-ui'
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance-wallet'
import globalStyles from '../../../../styles'
import {updateETHBalance} from '../../../../redux/wallet/wallet'
import trim from '../../../../utils/trim'

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
    backgroundColor: '#161240'
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
  balance: state.get('wallet').eth.balance,
  isFetching: state.get('wallet').eth.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  updateBalance: () => dispatch(updateETHBalance())
})

@connect(mapStateToProps, mapDispatchToProps)
class LHTBalanceWidget extends Component {
  componentWillMount () {
    this.props.updateBalance()
  }

  render () {
    return (
      <Paper style={styles.paper} zDepth={1}>
        <div style={styles.blockTop}>
          <AccountBalanceIcon style={styles.icon} />
          <span style={styles.currency}>ETH</span>
        </div>
        <Divider style={styles.divider} />
        <div style={styles.block}>
          {
            this.props.isFetching
              ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}} />
              : <span style={styles.value}>{(this.props.balance.toString() / 1e18).toFixed(2)}</span>
          }
        </div>
      </Paper>
    )
  }
}

export default LHTBalanceWidget
