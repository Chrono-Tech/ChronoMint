import React, { Component } from 'react'
import { CircularProgress, RaisedButton, TextField } from 'material-ui'
import styles from './styles'
import { validateMnemonic } from '../../../network/mnemonicProvider'

class LoginMnemonic extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mnemonicKey: '',
      isProvider: false,
      isValidated: false
    }
  }

  componentWillMount () {
    this.setState({mnemonicKey: ''})
  }

  handleChange = () => {
    const mnemonicKey = this.mnemonicKey.getValue()
    const isValidated = validateMnemonic(mnemonicKey)
    this.setState({mnemonicKey, isValidated})
  }

  render () {
    const {mnemonicKey, isValidated} = this.state
    const {isLoading} = this.props

    return (
      <div>
        <TextField
          ref={(input) => { this.mnemonicKey = input }}
          floatingLabelText='Mnemonic key'
          value={mnemonicKey}
          onChange={this.handleChange}
          errorText={isValidated || mnemonicKey === '' ? '' : 'Wrong mnemonic'}
          multiLine
          fullWidth />
        <RaisedButton
          label={isLoading
            ? <CircularProgress
              style={{verticalAlign: 'middle', marginTop: -2}}
              size={24}
              thickness={1.5} />
            : 'Login with mnemonic'}
          primary
          fullWidth
          disabled={!isValidated || isLoading}
          onTouchTap={() => this.props.onLogin(mnemonicKey)}
          style={styles.loginBtn} />
      </div>
    )
  }
}

export default LoginMnemonic
