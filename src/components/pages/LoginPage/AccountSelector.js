import React, { Component } from 'react'
import { FlatButton, MenuItem, RaisedButton, SelectField } from 'material-ui'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import styles from './styles'

class AccountSelector extends Component {
  render () {
    const {accounts} = this.props
    return (
      <div>
        <SelectField
          floatingLabelText='Ethereum account'
          value={this.props.selected}
          onChange={this.props.onChange}
          fullWidth>
          {accounts && accounts.map(a => <MenuItem key={a} value={a} primaryText={a} />)}
        </SelectField>
        <RaisedButton label='Select Account'
          primary
          fullWidth
          onTouchTap={this.props.onSelectAccount}
          disabled={!this.props.selected}
          style={styles.loginBtn} />
        <FlatButton
          label="Back"
          onTouchTap={this.props.onBack}
          style={styles.backBtn}
          icon={<ArrowBack />}/>
      </div>
    )
  }
}

export default AccountSelector
