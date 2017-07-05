import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GenerateMnemonic from '../GenerateMnemonic/GenerateMnemonic'
import Web3 from 'web3'
import web3Provider from '../../../../network/Web3Provider'
import mnemonicProvider, { validateMnemonic } from '../../../../network/mnemonicProvider'
import { getNetworkById, providerMap } from '../../../../network/settings'
import NetworkSelector from '../NetworkSelector'
import styles from '../styles.js'
import walletProvider from '../../../../network/walletProvider'
import LoginUploadWallet from '../LoginUploadWallet/LoginUploadWallet'
import { addError, clearErrors, loadAccounts, selectAccount } from '../../../../redux/network/actions'
import GenerateWallet from '../GenerateWallet/GenerateWallet'
import './LoginInfura.scss'
import { CircularProgress, FlatButton, FontIcon, RaisedButton, TextField } from 'material-ui'

const STEP_SELECT_NETWORK = 'step/SELECT_NETWORK'
export const STEP_SELECT_OPTION = 'step/SELECT_OPTION'
export const STEP_WALLET_PASSWORD = 'step/ENTER_WALLET_PASSWORD'
export const STEP_GENERATE_MNEMONIC = 'step/GENERATE_MNEMONIC'
export const STEP_GENERATE_WALLET = 'step/GENERATE_WALLET'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  accounts: state.get('network').accounts,
  isLocal: state.get('network').isLocal,
  isError: state.get('network').errors.length > 0
})

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  loadAccounts: () => dispatch(loadAccounts()),
  selectAccount: (value) => dispatch(selectAccount(value)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginInfura extends Component {
  constructor () {
    super()
    this.state = {
      step: STEP_SELECT_NETWORK,
      isMnemonicLoading: false,
      mnemonicKey: '',
      isProvider: false,
      isValidated: false,
      wallet: null
    }
  }

  componentWillMount () {
    // use it for tests
    // address: 0x13f219bbb158a49b3e09505fccc333916f11bacb
    // this.setState({
    //   mnemonicKey: 'leave plate clog interest recall distance actor gun flash cupboard ritual hold',
    //   isValidated: true
    // })
    this.setState({mnemonicKey: ''})
  }

  componentWillReceiveProps (props) {
    if (props.isError) {
      this.setState({
        isMnemonicLoading: false
      })
    }
  }

  setupWeb3AndLogin (provider) {
    // setup
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(provider)

    // login
    this.props.loadAccounts().then(() => {
      this.props.selectAccount(this.props.accounts[0])
      this.props.onLogin()
    }).catch((e) => {
      this.props.addError(e.message)
    })
  }

  handleMnemonicLogin = () => {
    this.props.clearErrors()
    this.setState({isMnemonicLoading: true})

    const {protocol, host} = getNetworkById(
      this.props.selectedNetworkId,
      providerMap.infura.id,
      this.props.isLocal
    )
    const providerUrl = protocol ? `${protocol}://${host}` : `//${host}`
    const provider = mnemonicProvider(this.state.mnemonicKey, providerUrl)
    this.setupWeb3AndLogin(provider)
  }

  handleWalletUpload = (password) => {
    this.props.clearErrors()
    const {protocol, host} = getNetworkById(
      this.props.selectedNetworkId,
      providerMap.infura.id,
      this.props.isLocal
    )
    const providerUrl = protocol ? `${protocol}://${host}` : `//${host}`
    try {
      const provider = walletProvider(this.state.wallet, password, providerUrl)
      this.setupWeb3AndLogin(provider)
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleGenerateMnemonicClick = () => {
    this.props.clearErrors()
    this.setStep(STEP_GENERATE_MNEMONIC)
  }

  handleGenerateWalletClick = () => {
    this.props.clearErrors()
    this.setStep(STEP_GENERATE_WALLET)
  }

  handleSelectNetwork = () => {
    this.props.clearErrors()
    if (this.state.step === STEP_SELECT_NETWORK) {
      this.setStep(STEP_SELECT_OPTION)
    }
  }

  handleBackClick = () => {
    this.props.clearErrors()
    this.setStep(STEP_SELECT_OPTION)
  }

  handleMnemonicChange = () => {
    const mnemonicKey = this.mnemonicKey.getValue()
    const isValidated = validateMnemonic(mnemonicKey.trim())
    this.setState({mnemonicKey, isValidated})
  }

  handleMnemonicBlur = () => {
    this.setState({mnemonicKey: this.mnemonicKey.getValue().trim()})
  }

  handleFileUploaded = (e) => {
    this.props.clearErrors()
    this.setState({wallet: e.target.result})
  }

  handleUploadClick = () => {
    this.walletFileUploadInput.click()
  }

  handleUploadFile = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = this.handleFileUploaded
    reader.readAsText(file)
    this.props.clearErrors()
    this.setStep(STEP_WALLET_PASSWORD)
  }

  setStep (step) {
    this.setState({step})
    this.handleToggleProvider(step)
  }

  handleToggleProvider (step) {
    this.props.onToggleProvider(step !== STEP_GENERATE_WALLET && step !== STEP_GENERATE_MNEMONIC)
  }

  render () {
    const {selectedNetworkId} = this.props
    const {step, isMnemonicLoading, mnemonicKey, isValidated} = this.state
    const isWalletOption = step === STEP_WALLET_PASSWORD
    const isMnemonicOption = step === STEP_SELECT_OPTION && selectedNetworkId
    const isGenerateMnemonic = step === STEP_GENERATE_MNEMONIC
    const isGenerateWallet = step === STEP_GENERATE_WALLET
    const isNetworkSelector = step !== STEP_GENERATE_WALLET && step !== STEP_GENERATE_MNEMONIC
    return (
      <div>
        {isNetworkSelector && <NetworkSelector onSelect={this.handleSelectNetwork} />}
        {isMnemonicOption && (
          <div>
            <TextField
              ref={(input) => { this.mnemonicKey = input }}
              floatingLabelText='Mnemonic key'
              value={mnemonicKey}
              onChange={this.handleMnemonicChange}
              onBlur={this.handleMnemonicBlur}
              errorText={(isValidated || mnemonicKey === '') ? '' : 'Wrong mnemonic'}
              multiLine
              fullWidth
              {...styles.textField} />
            <div styleName='row'>
              <div styleName='col'>
                <RaisedButton
                  label='Upload Wallet File'
                  secondary
                  fullWidth
                  disabled={isMnemonicLoading}
                  onTouchTap={this.handleUploadClick}
                  {...styles.secondaryButton} />
                <input
                  onChange={this.handleUploadFile}
                  ref={(input) => this.walletFileUploadInput = input}
                  type='file'
                  style={{display: 'none'}}
                />
              </div>
              <div styleName='col'>
                <RaisedButton
                  label={isMnemonicLoading
                    ? <CircularProgress
                      style={{verticalAlign: 'middle', marginTop: -2}}
                      size={24}
                      thickness={1.5} />
                    : 'Login with mnemonic'}
                  fullWidth
                  primary
                  disabled={!isValidated || isMnemonicLoading}
                  onTouchTap={this.handleMnemonicLogin}
                  {...styles.primaryButton} />
              </div>
            </div>
            <div styleName='row'>
              <div styleName='col'>
                <FlatButton
                  label='Generate New Wallet'
                  fullWidth
                  disabled={isMnemonicLoading}
                  onTouchTap={this.handleGenerateWalletClick}
                  icon={<FontIcon styleName='buttonIcon' className='material-icons' style={styles.icon}>account_balance_wallet</FontIcon>}
                  {...styles.flatButton} />
              </div>
              <div styleName='col'>
                <FlatButton
                  label='Generate Mnemonic Key'
                  fullWidth
                  disabled={isMnemonicLoading}
                  onTouchTap={this.handleGenerateMnemonicClick}
                  icon={<span styleName='buttonIcon generateIcon' />}
                  {...styles.flatButton} />
              </div>
            </div>
          </div>
        )}
        {isGenerateWallet && <GenerateWallet onBack={this.handleBackClick} />}
        {isGenerateMnemonic && <GenerateMnemonic onBack={this.handleBackClick} />}
        {isWalletOption &&
        <LoginUploadWallet
          onBack={this.handleBackClick}
          onLogin={this.handleWalletUpload} />}
      </div>
    )
  }
}

LoginInfura.propTypes = {
  isError: PropTypes.bool,
  loadAccounts: PropTypes.func,
  accounts: PropTypes.array,
  selectAccount: PropTypes.func,
  onLogin: PropTypes.func,
  addError: PropTypes.func,
  clearErrors: PropTypes.func,
  selectedNetworkId: PropTypes.number,
  isLocal: PropTypes.bool,
  onToggleProvider: PropTypes.func
}

export default LoginInfura
