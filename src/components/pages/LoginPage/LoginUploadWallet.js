import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RaisedButton, TextField } from 'material-ui'
import styles from './styles'
import { STEP_WALLET_PASSWORD, STEP_SELECT_OPTION } from './LoginInfura'
import { clearErrors } from '../../../redux/network/networkAction'

const mapStateToProps = (state) => ({
  selectedProvider: state.get('network').selectedProvider
})

const mapDispatchToProps = (dispatch) => ({
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginUploadWallet extends Component {
  constructor () {
    super()
    this.state = {
      wallet: null,
      password: ''
    }
  }

  componentWillMount () {
    this.setState({
      wallet: null,
      password: ''
    })
  }

  handleUploadClick = () => {
    this.refs.fileInput.click()
  }

  handleFileUploaded = (e) => {
    this.setState({wallet: e.target.result})
  }

  handleUploadFile = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = this.handleFileUploaded
    reader.readAsText(file)
    this.props.onUpload()
  }

  handlePasswordChange = () => {
    this.setState({password: this.refs.passwordInput.getValue()})
    this.props.clearErrors()
  }

  handleEnterPassword = () => {
    this.props.onLogin(this.state.wallet, this.state.password)
  }

  render () {
    const {password} = this.state
    const {step} = this.props

    switch (step) {
      case STEP_SELECT_OPTION:
        return (
          <div>
            <RaisedButton
              label='Upload Wallet File'
              primary
              fullWidth
              onTouchTap={this.handleUploadClick}
              style={styles.loginBtn} />
            <input
              onChange={this.handleUploadFile}
              ref='fileInput'
              type='file'
              style={{display: 'none'}}
            />
          </div>
        )
      case STEP_WALLET_PASSWORD:
        return (
          <div>
            <TextField
              ref='passwordInput'
              floatingLabelText='Enter password'
              type='password'
              value={password}
              onChange={this.handlePasswordChange}
              required
              fullWidth />
            <RaisedButton
              label='Proceed'
              primary
              fullWidth
              onTouchTap={this.handleEnterPassword}
              style={styles.loginBtn} />
          </div>
        )
      default:
        return null
    }
  }
}

export default LoginUploadWallet
