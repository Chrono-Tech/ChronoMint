import React from 'react'
import PropTypes from 'prop-types'
import { FlatButton, CircularProgress } from 'material-ui'
import FingerPrintIcon from 'material-ui/svg-icons/action/fingerprint'
import BackspaceIcon from 'material-ui/svg-icons/content/backspace'
import './LoginWithPinCode.scss'

export default class LoginWithPinCode extends React.Component {
  static propTypes = {
    onFingerprint: PropTypes.func,
    isFingerprintEnabled: PropTypes.bool,
    label: PropTypes.string,
    isPinCodeChecking: PropTypes.bool,
    onLogin: PropTypes.func
  }

  constructor () {
    super()

    this.state = {
      pinCode: '',
    }
  }

  handleDigit = (digit) => {
    const { pinCode } = this.state

    if (pinCode.length <= 3) {
      this.setState({
        pinCode: `${this.state.pinCode}${digit}`
      })
    }

    if (pinCode.length === 3) {
      this.props.onLogin(`${this.state.pinCode}${digit}`)
    }
  }

  handleFingerprint = () => {
    this.props.onFingerprint()
  }

  handleBackspace = () => {
    let { pinCode } = this.state

    pinCode = pinCode.slice(0, -1)

    this.setState({ pinCode })
  }

  render () {
    const { isPinCodeChecking } = this.props

    return (
      <div styleName='pinContainer'>
        { isPinCodeChecking && <div styleName='loaderContainer'>
          <CircularProgress
            style={{ flex: 1, justifyContent: 'center'}}
          />
        </div>}
        <div
          style={{
            opacity: this.props.isPinCodeChecking ? 0.4 : 1
          }}
        >
          <span styleName='pinDescription'>{this.props.label}</span>
          <div styleName='dotsContainer'>
            { Array(4).fill(0).map((value, index) => (
              <div
                styleName='dot'
                style={{
                  opacity: (index < this.state.pinCode.length) ? 1 : 0.5
                }}
                key={index}
              />
            ))}
          </div>
          <div>
            { Array(9).fill(0).map((value, index) => (
              <FlatButton
                key={index}
                style={{height: '48px', width: '33.33%'}}
                onClick={() => this.handleDigit(index + 1)}
                disabled={isPinCodeChecking}
              >
                <span styleName='digit'>
                  {index + 1}
                </span>
              </FlatButton>
            ))}
            { this.props.isFingerprintEnabled && <FlatButton
              style={{height: '48px', width: '33.33%'}}
              onClick={this.handleFingerprint}
              icon={<FingerPrintIcon color='white'/>}
              disabled={isPinCodeChecking}
            />}
            <FlatButton
              onClick={() => this.handleDigit(0)}
              style={{height: '48px', width: '33.33%'}}
              disabled={isPinCodeChecking}
            >
              <span styleName='digit'>
                0
              </span>
            </FlatButton>
            <FlatButton
              disabled={isPinCodeChecking}
              style={{height: '48px', width: '33.33%'}}
              onClick={this.handleBackspace}
              icon={<BackspaceIcon color='white'/>}
            />
          </div>
        </div>
      </div>
    )
  }
}
