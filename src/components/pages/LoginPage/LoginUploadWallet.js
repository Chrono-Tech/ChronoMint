import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CircularProgress, FlatButton, RaisedButton, TextField } from 'material-ui'
import styles from './styles'
import { STEP_WALLET_PASSWORD, STEP_SELECT_OPTION } from './LoginInfura'
import { clearErrors } from '../../../redux/network/actions'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

const mapStateToProps = (state) => ({
  selectedProvider: state.get('network').selectedProvider,
  isError: state.get('network').errors.length > 0
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
      password: '',
      isWalletLoading: false
    }
  }

  componentWillMount () {
    this.setState({
      wallet: null,
      password: '',
      isWalletLoading: false
    })
  }

  componentWillReceiveProps (props) {
    if (props.isError) {
      this.setState({isWalletLoading: false})
    }
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
    this.setState({isWalletLoading: true})
    this.props.clearErrors()
    this.forceUpdate()
    this.props.onLogin(this.state.wallet, this.state.password)
  }

  render () {
    const {password, isWalletLoading} = this.state
    const {step, isLoading} = this.props

    switch (step) {
      case STEP_SELECT_OPTION:
        return (
          <div>
            <RaisedButton
              label='Upload Wallet File'
              primary
              fullWidth
              disabled={isLoading}
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
              label={isWalletLoading ? <CircularProgress
                style={{verticalAlign: 'middle', marginTop: -2}} size={24}
                thickness={1.5} /> : 'Login'}
              primary
              fullWidth
              disabled={isWalletLoading}
              onTouchTap={this.handleEnterPassword}
              style={styles.loginBtn} />
            {isWalletLoading && <div style={styles.tip}>
              <em>Be patient, it will take a while</em>
            </div>}
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

LoginUploadWallet.propTypes = {
  onBack: PropTypes.func,
  onLogin: PropTypes.func,
  clearErrors: PropTypes.func,
  onUpload: PropTypes.func,
  isError: PropTypes.bool,
  step: PropTypes.string,
  isLoading: PropTypes.bool
}

export default LoginUploadWallet
