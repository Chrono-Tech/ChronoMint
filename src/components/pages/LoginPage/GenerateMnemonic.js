import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RaisedButton, FlatButton } from 'material-ui'
import styles from './styles'
import { STEP_GENERATE_MNEMONIC, STEP_SELECT_OPTION } from './LoginInfura'
import { generateMnemonic } from '../../../network/mnemonicProvider'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

class GenerateMnemonic extends Component {
  render () {
    const {step, isLoading} = this.props
    const newMnemonicKey = generateMnemonic()

    switch (step) {
      case STEP_SELECT_OPTION:
        return (
          <RaisedButton
            label='Generate Mnemonic Key'
            primary
            fullWidth
            disabled={isLoading}
            onTouchTap={() => this.props.onClick()}
            style={styles.loginBtn} />
        )
      case STEP_GENERATE_MNEMONIC:
        return (
          <div>
            <div>New mnemonic key generated:</div>
            <div style={styles.dashedBox}>{newMnemonicKey}</div>
            <div style={styles.red}>Save this key in safety place and login with it on previous form.</div>
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

GenerateMnemonic.propTypes = {
  step: PropTypes.string,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  onBack: PropTypes.func
}

export default GenerateMnemonic
