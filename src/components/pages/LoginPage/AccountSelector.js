import React, { Component } from 'react'
import {connect} from 'react-redux'
import { MenuItem, RaisedButton, SelectField } from 'material-ui'
import styles from './styles'
import { loadAccounts, selectAccount } from '../../../redux/network/networkAction'

const mapStateToProps = (state) => ({
  accounts: state.get('network').accounts,
  selectedAccount: state.get('network').selectedAccount
})

const mapDispatchToProps = (dispatch) => ({
  loadAccounts: () => dispatch(loadAccounts()),
  selectAccount: (value) => dispatch(selectAccount(value))
})

@connect(mapStateToProps, mapDispatchToProps)
class AccountSelector extends Component {
  componentWillMount () {
    this.props.loadAccounts()
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
      </div>
    )
  }
}

export default AccountSelector
