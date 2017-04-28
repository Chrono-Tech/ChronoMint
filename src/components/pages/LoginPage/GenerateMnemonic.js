import React, { Component } from 'react'
import { RaisedButton } from 'material-ui'
import styles from './styles'
import { STEP_GENERATE_MNEMONIC, STEP_SELECT_OPTION } from './LoginInfura'

class GenerateMnemonic extends Component {
  render () {
    const {step} = this.props

    switch (step) {
      case STEP_SELECT_OPTION:
        return (
          <RaisedButton
            label='Generate Mnemonic Key'
            primary
            fullWidth
            onTouchTap={() => this.props.onClick()}
            style={styles.loginBtn}/>
        )
      case STEP_GENERATE_MNEMONIC:
        return (
          <div>
            <div>new key generated:</div>
            <div>123</div>
            <div>Save it...</div>
            <RaisedButton
              label='Login'
              primary
              fullWidth
              onTouchTap={() => this.props.onLogin()}
              style={styles.loginBtn}/>
          </div>
        )
      default:
        return null
    }
  }
}

export default GenerateMnemonic
