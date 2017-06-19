import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { STEP_GENERATE_WALLET, STEP_SELECT_OPTION } from './LoginInfura'
import { RaisedButton, TextField, Checkbox, FlatButton } from 'material-ui'
import styles from './styles'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

class GenerateWallet extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    step: PropTypes.string,
    isLoading: PropTypes.bool
  }

  constructor () {
    super()
    this.state = {
      password: '',
      isWarningSuppressed: false
    }
  }

  handlePasswordChange = (target, value) => {
    this.setState({ password: value})
  }

  handleWarningCheck = (target, value) => {
    console.log('--GenerateWallet#handleWarningCheck', value)
    this.setState({isWarningSuppressed: value})
  }

  render () {
    const {step, isLoading} = this.props
    const {password, isWarningSuppressed} = this.state
    const isPasswordValid = password.length > 8

    switch (step) {
      case STEP_SELECT_OPTION:
        return (
          <RaisedButton
            label='Generate New Wallet'
            secondary
            fullWidth
            disabled={isLoading}
            onTouchTap={() => this.props.onClick()}
            style={styles.loginBtn} />
        )
      case STEP_GENERATE_WALLET:
        return (
          <div>
            <div style={styles.walletNote}>The Wallet is network independent.<br />Enter password for new wallet:</div>
            <TextField
              floatingLabelText='Password'
              onChange={this.handlePasswordChange}
              type='password'
              value={password}
              errorText={!isPasswordValid && 'At least 8 characters'}
              fullWidth />
            <Checkbox
              label={(
                <div style={styles.red}>
                  Keep it safe. Make a backup. Don't share it with anyone. Don't lose it. It cannot be recovered if you lose it.<br />
                  I understand.<br />
                  Continue.
                </div>
              )}
              onCheck={this.handleWarningCheck}
              checked={isWarningSuppressed}
            />
            <RaisedButton
              label='Download New Wallet'
              secondary
              fullWidth
              disabled={!isWarningSuppressed || !isPasswordValid}
              onTouchTap={() => this.props.onClick()}
              style={styles.loginBtn} />
            <FlatButton
              label='Back'
              onTouchTap={this.props.onBack}
              style={styles.backBtn}
              icon={<ArrowBack />} />
          </div>
        )
      default:
        return null
    }
  }
}

export default GenerateWallet
