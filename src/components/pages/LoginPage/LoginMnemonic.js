import React, { Component } from 'react'
import { RaisedButton, TextField } from 'material-ui'
import styles from './styles'

class LoginMnemonic extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mnemonicKey: '',
      isProvider: false
    }
  }

  componentWillUnmount () {
    this.setState({ mnemonicKey: '' })
  }

  handleChange = () => {
    this.setState({mnemonicKey: this.mnemonicKey.getValue()})
  }

  render () {
    const { mnemonicKey } = this.state
    return (
      <div>
        <TextField
          ref={(input) => { this.mnemonicKey = input }}
          floatingLabelText='Mnemonic key'
          value={mnemonicKey}
          onChange={this.handleChange}
          multiLine
          fullWidth />
        <RaisedButton
          label='Proceed'
          primary
          fullWidth
          onTouchTap={() => this.props.onLogin(mnemonicKey)}
          style={styles.loginBtn} />
      </div>
    )
  }
}

export default LoginMnemonic
