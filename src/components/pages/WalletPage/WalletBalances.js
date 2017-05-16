import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, TextField, Divider } from 'material-ui'
import LS from '../../../dao/LocalStorageDAO'
import globalStyles from '../../../styles'
import { Translate } from 'react-redux-i18n'
import { updateETHBalance, updateLHTBalance, updateTIMEBalance } from '../../../redux/wallet/actions'
import { renderBalanceWidget } from '../../common/BalanceWidget/BalanceWidget'

const mapStateToProps = (state) => {
  const wallet = state.get('wallet')

  return {
    eth: wallet.eth,
    lht: wallet.lht,
    time: wallet.time
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateETHBalance: () => dispatch(updateETHBalance(LS.getAccount())),
  updateLHTBalance: () => dispatch(updateLHTBalance()),
  updateTIMEBalance: (account) => dispatch(updateTIMEBalance(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class BalancesWidget extends Component {
  componentWillMount () {
    this.props.updateETHBalance()
    this.props.updateLHTBalance()
    this.props.updateTIMEBalance()
  }

  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}><Translate value='terms.balances' /></h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />

        <TextField
          floatingLabelText={<Translate value='terms.account' />}
          fullWidth
          value={LS.getAccount() || ''}
          disabled />
        <div className='row' style={{marginTop: 25}}>
          <div className='col-sm-4'>
            {renderBalanceWidget(this.props.eth)}
          </div>
          <div className='col-sm-4'>
            {renderBalanceWidget(this.props.lht)}
          </div>
          <div className='col-sm-4'>
            {renderBalanceWidget(this.props.time)}
          </div>
        </div>
      </Paper>
    )
  }
}

export default BalancesWidget
