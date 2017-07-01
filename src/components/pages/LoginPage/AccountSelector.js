import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MenuItem, RaisedButton, SelectField } from 'material-ui'
import styles from './styles'
import { addError, loadAccounts, selectAccount } from '../../../redux/network/actions'

const mapStateToProps = (state) => ({
  accounts: state.get('network').accounts,
  selectedAccount: state.get('network').selectedAccount
})

const mapDispatchToProps = (dispatch) => ({
  loadAccounts: () => dispatch(loadAccounts()),
  selectAccount: (value) => dispatch(selectAccount(value)),
  addError: (error) => dispatch(addError(error))
})

@connect(mapStateToProps, mapDispatchToProps)
class AccountSelector extends Component {
  componentWillMount () {
    this.props.loadAccounts().then(() => {
      // TODO @dkchv: move to actions ?
      // autoselect if only one account exists
      const {accounts} = this.props
      if (accounts.length === 1) {
        this.props.selectAccount(accounts[0])
      }
    }).catch((e) => {
      this.props.addError(e.message)
    })
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
          fullWidth
          {...styles.selectField}>
          {accounts && accounts.map(a => <MenuItem key={a} value={a} primaryText={a} />)}
        </SelectField>
        <RaisedButton
          label='Select Account'
          primary
          fullWidth
          onTouchTap={this.props.onSelectAccount}
          disabled={!selectedAccount}
          style={styles.primaryButton} />
      </div>
    )
  }
}

AccountSelector.propTypes = {
  onSelectAccount: PropTypes.func,
  loadAccounts: PropTypes.func,
  selectAccount: PropTypes.func,
  addError: PropTypes.func,
  accounts: PropTypes.array,
  selectedAccount: PropTypes.string
}

export default AccountSelector
