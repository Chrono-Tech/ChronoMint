import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { STEP_GENERATE_WALLET, STEP_SELECT_OPTION } from './LoginInfura'
import { RaisedButton, TextField, Checkbox, FlatButton } from 'material-ui'
import styles from './styles'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import walletGenerator from '../../../network/walletGenerator'
import download from 'react-file-download'
import { addError, clearErrors } from '../../../redux/network/actions'

const initialState = {
  password: '',
  isWarningSuppressed: false,
  walletJSON: null,
  isDownloaded: false
}

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(null, mapDispatchToProps)
class GenerateWallet extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    addError: PropTypes.func,
    clearErrors: PropTypes.func,
    step: PropTypes.string,
    isLoading: PropTypes.bool
  }

  constructor () {
    super()
    this.state = {
      ...initialState
    }
  }

  handlePasswordChange = (target, value) => {
    this.setState({password: value})
  }

  handleWarningCheck = (target, value) => {
    this.setState({isWarningSuppressed: value})
  }

  handleGenerateWalletClick = async () => {
    this.props.clearErrors()
    try {
      if (!this.state.walletJSON) {
        // create new instance
        const walletJSON = await walletGenerator(this.state.password)
        this.setState({
          walletJSON,
          password: ''
        })
      }

      const wallet = this.state.walletJSON
      download(JSON.stringify(wallet), `${wallet.id}.dat`)
      this.setState({
        isDownloaded: true
      })
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleBackClick = () => {
    this.setState({...initialState})
    this.props.onBack()
  }

  render () {
    const {step, isLoading} = this.props
    const {password, isWarningSuppressed, isDownloaded} = this.state
    const isPasswordValid = password.length > 8

    switch (step) {
      case STEP_SELECT_OPTION:
        return (
          <RaisedButton
            label='Generate New Wallet'
            secondary
            fullWidth
            disabled={isLoading}
            onTouchTap={() => this.props.onClick()}
            style={styles.loginBtn} />
        )
      case STEP_GENERATE_WALLET:
        return (
          <div>
            <div style={styles.walletNote}>The Wallet is network independent.<br />Enter password for new wallet:</div>
            {!isDownloaded && (
              <div>
                <TextField
                  floatingLabelText='Password'
                  onChange={this.handlePasswordChange}
                  type='password'
                  value={password}
                  errorText={!isPasswordValid && 'At least 8 characters'}
                  fullWidth />
                <Checkbox
                  label={(
                    <div style={styles.red}>
                      Keep it safe. Make a backup. Don't share it with anyone. Don't lose it. It cannot be recovered if
                      you
                      lose it.<br />
                      I understand.<br />
                      Continue.
                    </div>
                  )}
                  onCheck={this.handleWarningCheck}
                  checked={isWarningSuppressed}
                />
              </div>
            )}
            <RaisedButton
              label='Download Wallet'
              secondary
              fullWidth
              disabled={!isDownloaded && !(isWarningSuppressed || isPasswordValid)}
              onTouchTap={this.handleGenerateWalletClick}
              style={styles.loginBtn} />
            <FlatButton
              label='Back'
              onTouchTap={this.handleBackClick}
              style={styles.backBtn}
              icon={<ArrowBack />} />
          </div>
        )
      default:
        return null
    }
  }
}

export default GenerateWallet
