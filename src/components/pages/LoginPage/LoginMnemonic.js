import React, { Component } from 'react'
import { RaisedButton, TextField } from 'material-ui'
import styles from './styles'
import { validateMnemonic } from '../../../network/MnemonicProvider'

class LoginMnemonic extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mnemonicKey: '',
      isProvider: false,
      isValidated: false
    }
  }

  componentWillUnmount () {
    this.setState({ mnemonicKey: '' })
  }

  handleChange = () => {
    const mnemonicKey = this.mnemonicKey.getValue()
    const isValidated = validateMnemonic(mnemonicKey)
    this.setState({mnemonicKey, isValidated})
  }

  render () {
    const { mnemonicKey, isValidated } = this.state
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
          label='Login with mnemonic'
          primary
          fullWidth
          disabled={!isValidated}
          onTouchTap={() => this.props.onLogin(mnemonicKey)}
          style={styles.loginBtn} />
      </div>
    )
  }
}

export default LoginMnemonic
