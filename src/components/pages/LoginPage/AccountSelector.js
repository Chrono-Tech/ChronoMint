import React, { Component } from 'react'
import {connect} from 'react-redux'
import { FlatButton, MenuItem, RaisedButton, SelectField } from 'material-ui'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import styles from './styles'
import { clearWeb3Provider, loadAccounts, selectAccount } from '../../../redux/network/networkAction'

const mapStateToProps = (state) => ({
  accounts: state.get('network').accounts,
  selectedAccount: state.get('network').selectedAccount
})

const mapDispatchToProps = (dispatch) => ({
  loadAccounts: () => dispatch(loadAccounts()),
  clearWeb3Provider: () => dispatch(clearWeb3Provider()),
  selectAccount: (value) => dispatch(selectAccount(value))
})

@connect(mapStateToProps, mapDispatchToProps)
class AccountSelector extends Component {
  componentWillMount () {
    this.props.loadAccounts()
  }

  handleBackClick = () => {
    this.props.clearWeb3Provider()
  }

  handleChange = (event, index, value) => {
    this.props.selectAccount(value)
  }

  render () {
    const {accounts, selectedAccount} = this.props
    return (
      <div>
        <SelectField
          floatingLabelText='Ethereum account'
          value={selectedAccount}
          onChange={this.handleChange}
          fullWidth>
          {accounts && accounts.map(a => <MenuItem key={a} value={a} primaryText={a} />)}
        </SelectField>
        <RaisedButton label='Select Account'
          primary
          fullWidth
          onTouchTap={this.props.onSelectAccount}
          disabled={!selectedAccount}
          style={styles.loginBtn} />
        <FlatButton
          label="Back"
          onTouchTap={this.handleBackClick}
          style={styles.backBtn}
          icon={<ArrowBack />}/>
      </div>
    )
  }
}

export default AccountSelector
