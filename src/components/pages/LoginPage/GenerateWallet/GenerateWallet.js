import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Checkbox, MuiThemeProvider, RaisedButton, TextField } from 'material-ui'
import walletGenerator from '../../../../network/walletGenerator'
import download from 'react-file-download'
import { addError, clearErrors } from '../../../../redux/network/actions'
import theme from '../../../../styles/themes/default'
import Warning from '../Warning/Warning'
import { Translate } from 'react-redux-i18n'
import BackButton from '../BackButton/BackButton'
import styles from '../stylesLoginPage'
import { addWallet } from '../../../../redux/sensitive/actions'
import connectRN from '../../../../connectReactNative'
import LoginWithPinCode from '../LoginWithPinCode/LoginWithPinCode'
import './GenerateWallet.scss'

const initialState = {
  password: '',
  isWarningSuppressed: false,
  walletJSON: null,
  isDownloaded: false
}

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  clearErrors: () => dispatch(clearErrors()),
  addWallet: (wallet) => dispatch(addWallet(wallet))
})

const mapStateToProps = (state) => ({
  selectedProviderId: state.get('network').selectedProviderId,
  selectedNetworkId: state.get('network').selectedNetworkId
})

@connect(mapStateToProps, mapDispatchToProps)
class GenerateWallet extends Component {
  static propTypes = {
    selectedProviderId: PropTypes.number,
    selectedNetworkId: PropTypes.number,
    onBack: PropTypes.func.isRequired,
    onBackToOptions: PropTypes.func,
    addError: PropTypes.func,
    clearErrors: PropTypes.func
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
      const { password } = this.state
      if (!this.state.walletJSON) {
        // create new instance
        const walletJSON = await walletGenerator(this.state.password)
        this.setState({
          walletJSON,
          password: ''
        })
      }

      const wallet = this.state.walletJSON

      if (window.isMobile) {
        this.setState({
          walletData: {
            wallet,
            password,
            provider: this.props.selectedProviderId,
            network: this.props.selectedNetworkId
          }
        })
      } else {
        download(JSON.stringify(wallet), `${wallet.id}.dat`)
      }

      this.setState({
        isDownloaded: true
      })
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handlePinCode = async (nextPinCode) => {
    this.props.clearErrors()
    const { pinCode } = this.state
    if (!pinCode) {
      this.setState({ 
        pinCode: nextPinCode
      })
      return
    }

    if (pinCode !== nextPinCode) {
      this.props.addError('Pin codes did not match')
      return
    }

    await connectRN.postMessage('SET_PINCODE', { pinCode: nextPinCode })

    await connectRN.postMessage('ADD_WALLET', this.state.walletData)

    this.props.onBackToOptions()
  }

  render () {
    const {password, isWarningSuppressed, isDownloaded, pinCode} = this.state
    const isPasswordValid = password.length > 8

    return (
      <div>
        <BackButton
          onClick={() => this.props.onBack()}
          to='loginWithWallet'
        />
        <MuiThemeProvider muiTheme={theme}>
          <div styleName='root'>
            {!isDownloaded ? (
              <div>
                <div styleName='hint'><Translate value='GenerateWallet.enterPassword'/></div>
                <TextField
                  floatingLabelText={<Translate value='GenerateWallet.password'/>}
                  onChange={this.handlePasswordChange}
                  type='password'
                  value={password}
                  errorText={!isPasswordValid && <Translate value='GenerateWallet.passwordWarning'/>}
                  fullWidth/>
                <Warning/>
              </div>
            ) : (
              <div styleName='hint'><Translate value='GenerateWallet.walletSuccess'/></div>
            )}
            <div styleName='actions'>
              {!isDownloaded && (
                <div styleName='actionConfirm'>
                  <Checkbox
                    label={<Translate value='GenerateWallet.iUnderstand'/>}
                    onCheck={this.handleWarningCheck}
                    checked={isWarningSuppressed}
                    {...styles.checkbox}
                  />
                </div>
              )}
              <RaisedButton
                label={<Translate value='GenerateWallet.continue'/>}
                primary
                disabled={!isDownloaded && (!isWarningSuppressed || !isPasswordValid)}
                onTouchTap={this.handleGenerateWalletClick}
                style={styles.primaryButton}
              />
            </div>
          </MuiThemeProvider>
        )}
      </div>
    )
  }
}

export default GenerateWallet
