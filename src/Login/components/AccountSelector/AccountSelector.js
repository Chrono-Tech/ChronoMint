import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CircularProgress, MenuItem, RaisedButton, SelectField } from 'material-ui'
import styles from 'Login/components/stylesLoginPage'
import NetworkService, { addError } from 'redux/network/actions'
import './AccountSelector.scss'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = (state) => ({
  accounts: state.get('network').accounts,
  selectedAccount: state.get('network').selectedAccount,
  isLoading: state.get('network').isLoading
})

const mapDispatchToProps = (dispatch) => ({
  loadAccounts: () => dispatch(NetworkService.loadAccounts()),
  selectAccount: (value) => dispatch(NetworkService.selectAccount(value)),
  addError: (error) => dispatch(addError(error))
})

@connect(mapStateToProps, mapDispatchToProps)
class AccountSelector extends Component {

  static propTypes = {
    onSelectAccount: PropTypes.func,
    loadAccounts: PropTypes.func,
    selectAccount: PropTypes.func,
    addError: PropTypes.func,
    accounts: PropTypes.array,
    selectedAccount: PropTypes.string,
    isLoading: PropTypes.bool
  }

  componentWillMount () {
    this.props.loadAccounts().then(() => {
      // TODO @dkchv: move to actions ?
      // autoselect if only one account exists
      const {accounts} = this.props
      if (accounts.length === 1) {
        this.props.selectAccount(accounts[0])
      }
    }).catch((e) => {
      this.props.selectAccount(null)
      this.props.addError(e.message)
    })
  }

  handleChange = (event, index, value) => {
    this.props.selectAccount(value)
  }

  render () {
    const {accounts, selectedAccount, isLoading} = this.props
    return (
      <div>
        <SelectField
          floatingLabelText={<Translate value='AccountSelector.address'/>}
          value={selectedAccount}
          onChange={this.handleChange}
          fullWidth
          {...styles.selectField}>
          {accounts && accounts.map(a => <MenuItem key={a} value={a} primaryText={a} />)}
        </SelectField>
        <div styleName='actions'>
          <div styleName='action'>
            <RaisedButton
              label={isLoading ? <CircularProgress
                style={{verticalAlign: 'middle', marginTop: -2}} size={24}
                thickness={1.5} /> : <Translate value='AccountSelector.selectAddress'/>}
              primary
              fullWidth
              onTouchTap={() => this.props.onSelectAccount()}
              disabled={!selectedAccount || isLoading}
              style={styles.primaryButton} />
          </div>
        </div>
      </div>
    )
  }
}

export default AccountSelector
