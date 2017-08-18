import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CircularProgress, RaisedButton, TextField } from 'material-ui'
import styles from '../styles.js'
import './LoginWithPrivateKey.scss'
import { validatePrivateKey } from 'network/privateKeyProvider'

class LoginWithPrivateKey extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onLogin: PropTypes.func
  }

  constructor () {
    super()
    this.state = {
      privateKey: '',
      isValidated: false
    }
  }

  handlePrivateKeyChange = () => {
    const privateKey = this.privateKey.getValue()
    const isValidated = validatePrivateKey(privateKey.trim())
    this.setState({privateKey, isValidated})
  }

  handleLogin = () => {
    this.props.onLogin(this.state.privateKey)
  }

  render () {
    const {isValidated, privateKey} = this.state
    const {isLoading, isDisabled}  = this.props
    return (
      <div>
        <TextField
          ref={(input) => { this.privateKey = input }}
          floatingLabelText='Private key'
          value={privateKey}
          onChange={this.handlePrivateKeyChange}
          errorText={(isValidated || privateKey === '') ? '' : 'Wrong private key'}
          multiLine
          fullWidth
          spellCheck={false}
          {...styles.textField} />

        <div styleName='actions'>
          <div styleName='action'>
            <RaisedButton
              label={isLoading
                ? <CircularProgress
                  style={{verticalAlign: 'middle', marginTop: -2}}
                  size={24}
                  thickness={1.5} />
                : 'Login with private key'}
              fullWidth
              primary
              disabled={!isValidated || isDisabled}
              onTouchTap={this.handleLogin}
              {...styles.primaryButton} />
          </div>
        </div>
      </div>
    )
  }
}

export default LoginWithPrivateKey
