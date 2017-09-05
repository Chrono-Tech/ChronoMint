import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CircularProgress, RaisedButton, TextField } from 'material-ui'
import { validatePrivateKey } from 'network/privateKeyProvider'
import BackButton from '../BackButton/BackButton'
import styles from '../stylesLoginPage'
import './LoginWithPrivateKey.scss'

const mapStateToProps = (state) => ({
  isLoading: state.get('network').isLoading
})

@connect(mapStateToProps, null)
class LoginWithPrivateKey extends Component {

  static propTypes = {
    isLoading: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired
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

  render () {
    const {isValidated, privateKey} = this.state
    const {isLoading} = this.props
    return (
      <div>
        <div styleName='back'>
          <BackButton
            onClick={() => this.props.onBack()}
            to='options'
          />
        </div>
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
              disabled={!isValidated || isLoading}
              onTouchTap={() => this.props.onLogin(privateKey)}
              {...styles.primaryButton} />
          </div>
        </div>
      </div>
    )
  }
}

export default LoginWithPrivateKey
