import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CircularProgress, FlatButton, RaisedButton, TextField } from 'material-ui'
import BackButton from '../BackButton/BackButton'
import { clearErrors, loading } from 'redux/network/actions'
import styles from '../stylesLoginPage'
import './LoginWithWallet.scss'

const mapStateToProps = (state) => ({
  isLoading: state.get('network').isLoading
})

const mapDispatchToProps = (dispatch) => ({
  clearErrors: () => dispatch(clearErrors()),
  loading: (isLoading) => dispatch(loading(isLoading))
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginWithWallet extends Component {

  static propTypes = {
    isLoading: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    clearErrors: PropTypes.func,
    loading: PropTypes.func
  }

  constructor () {
    super()
    this.state = {
      password: '',
      wallet: null,
      isUploaded: false,
      isUploading: false,
      fileName: ''
    }
  }

  handleFileUploaded = (e) => {
    this.props.clearErrors()
    this.setState({
      isUploading: false,
      isUploaded: true,
      wallet: e.target.result
    })
  }

  handleUploadFile = (e) => {
    const file = e.target.files[0]
    if (!file) {
      return
    }
    this.setState({
      isUploading: true,
      fileName: file.name
    })
    const reader = new FileReader()
    reader.onload = this.handleFileUploaded
    reader.readAsText(file)
    this.props.clearErrors()
  }

  handlePasswordChange = (target, value) => {
    this.setState({password: value})
    this.props.clearErrors()
  }

  handleEnterPassword = () => {
    this.props.clearErrors()
    this.forceUpdate()
    this.props.onLogin(this.state.wallet, this.state.password)
  }

  handleRemoveWallet = () => {
    this.setState({
      wallet: null,
      isUploaded: false,
      isUploading: false,
      fileName: ''
    })
    this.walletFileUploadInput.value = ''
  }

  render () {
    const {isLoading} = this.props
    const {password, isUploading, isUploaded, fileName} = this.state

    return (
      <div styleName='root'>
        <div styleName='back'>
          <BackButton
            onClick={() => this.props.onBack()}
            to='options'
          />
        </div>
        <div>

          {!isUploaded && !isUploading && (
            <div
              styleName='upload'
              onTouchTap={() => this.walletFileUploadInput.click()}
            >
              <div styleName='uploadContent'>Upload Wallet File</div>
            </div>
          )}

          {isUploading && (
            <div styleName='progress'>
              <CircularProgress
                size={16}
                color={styles.colors.colorPrimary1}
                thickness={1.5} />
              <span styleName='progressText'>Uploading</span>
            </div>
          )}

          {isUploaded && (
            <div styleName='uploaded'>
              <div styleName='walletIcon' className='material-icons'>attachment</div>
              <div styleName='walletName'>{fileName}</div>
              <div
                styleName='walletRemove'
                className='material-icons'
                onTouchTap={this.handleRemoveWallet}
              >delete</div>
            </div>
          )}

          <input
            onChange={this.handleUploadFile}
            ref={(input) => this.walletFileUploadInput = input}
            type='file'
            styleName='hide'
          />
        </div>

        <TextField
          floatingLabelText='Enter password'
          type='password'
          value={password}
          onChange={this.handlePasswordChange}
          required
          fullWidth
          {...styles.textField}
        />

        {isLoading && <div styleName='tip'>
          <em>Be patient, it will take a while...</em>
        </div>}

        <div styleName='actions'>
          <div styleName='action'>
            <FlatButton
              label='Generate New Wallet'
              fullWidth
              disabled={isLoading}
              onTouchTap={() => this.props.onGenerate()}
              icon={<i className='material-icons' styleName='buttonIcon'>account_balance_wallet</i>}
              {...styles.flatButton} />
          </div>
          <div styleName='action'>
            <RaisedButton
              label={isLoading ? <CircularProgress
                style={{verticalAlign: 'middle', marginTop: -2}} size={24}
                thickness={1.5} /> : 'Login'}
              primary
              fullWidth
              disabled={isLoading || !isUploaded || !password || password === ''}
              onTouchTap={this.handleEnterPassword}
              style={styles.primaryButton}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LoginWithWallet
