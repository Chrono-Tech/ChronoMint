import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Web3 from 'web3'
import { Translate } from 'react-redux-i18n'
import web3Provider from 'network/Web3Provider'
import web3Utils from 'network/Web3Utils'
import { btcProvider, bccProvider } from 'network/BitcoinProvider'
import mnemonicProvider  from 'network/mnemonicProvider'
import privateKeyProvider from 'network/privateKeyProvider'
import walletProvider from 'network/walletProvider'
import ledgerProvider from 'network/LedgerProvider'
import { addError, clearErrors, loadAccounts, selectAccount, getProviderURL, loading, getProviderSettings } from 'redux/network/actions'
import { loginLedger } from 'redux/ledger/actions'
import GenerateMnemonic from '../GenerateMnemonic/GenerateMnemonic'
import GenerateWallet from '../GenerateWallet/GenerateWallet'
import NetworkSelector from '../NetworkSelector/NetworkSelector'
import NetworkStatus from '../NetworkStatus/NetworkStatus'
import LoginWithPrivateKey from '../LoginWithPrivateKey/LoginWithPrivateKey'
import LoginLedger from '../LoginWithLedger/LoginWithLedger'
import LoginWithMnemonic from '../LoginWithMnemonic/LoginWithMnemonic'
import LoginWithWallet from '../LoginWithWallet/LoginWithWallet'
import LoginWithPinCode from '../LoginWithPinCode/LoginWithPinCode'
import connectReactNative from '../../../../connectReactNative'
import { getPrivateKeyFromWallet } from '../../../../network/walletProvider'
import { getPrivateKeyFromMnemonic } from '../../../../network/mnemonicProvider'
import './LoginWithOptions.scss'

export const STEP_SELECT_OPTION = 'step/SELECT_OPTION'
export const STEP_GENERATE_WALLET = 'step/GENERATE_WALLET'
export const STEP_GENERATE_MNEMONIC = 'step/GENERATE_MNEMONIC'
export const STEP_LOGIN_WITH_MNEMONIC = 'step/LOGIN_WITH_MNEMONIC'

const STEP_SELECT_NETWORK = 'step/SELECT_NETWORK'
const STEP_LOGIN_WITH_WALLET = 'step/LOGIN_WITH_WALLET'
const STEP_LOGIN_WITH_PRIVATE_KEY = 'step/LOGIN_WITH_PRIVATE_KEY'
const STEP_LOGIN_WITH_LEDGER = 'step/LOGIN_WITH_LEDGER'
const STEP_SET_PINCODE = 'step/SET_PINCODE'

const loginOptions = [{
  nextStep: STEP_LOGIN_WITH_MNEMONIC,
  title: 'Mnemonic key',
  devices: ['web', 'desktop', 'mobile']
}, {
  nextStep: STEP_LOGIN_WITH_WALLET,
  title: 'Wallet file',
  devices: ['web', 'desktop', 'mobile']
}, {
  nextStep: STEP_LOGIN_WITH_PRIVATE_KEY,
  title: 'Private key',
  devices: ['web', 'desktop', 'mobile']
}, {
  nextStep: STEP_LOGIN_WITH_LEDGER,
  title: 'Ledger Nano',
  devices: ['web', 'desktop']
}]

const filterByDevice = (device) =>
  (item) =>
    item.devices.some((item) => item === device)

const isProviderOrNetworkChanded = (props, nextProps) => !!(
  (
    props.selectedProviderId !== nextProps.selectedProviderId ||
    props.selectedNetworkId !== nextProps.selectedNetworkId
  ) &&
  (
    nextProps.selectedProviderId && nextProps.selectedNetworkId
  )
)

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  selectedProviderId: state.get('network').selectedProviderId,
  accounts: state.get('network').accounts
})

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  loadAccounts: () => dispatch(loadAccounts()),
  selectAccount: (value) => dispatch(selectAccount(value)),
  clearErrors: () => dispatch(clearErrors()),
  getProviderURL: () => dispatch(getProviderURL()),
  getProviderSettings: () => dispatch(getProviderSettings()),
  loading: () => dispatch(loading()),
  loginLedger: () => dispatch(loginLedger())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginWithOptions extends Component {
  static propTypes = {
    loadAccounts: PropTypes.func,
    accounts: PropTypes.array,
    selectAccount: PropTypes.func,
    getProviderURL: PropTypes.func,
    getProviderSettings: PropTypes.func,
    onLogin: PropTypes.func,
    addError: PropTypes.func,
    clearErrors: PropTypes.func,
    onToggleProvider: PropTypes.func,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number,
    loading: PropTypes.func,
    loginLedger: PropTypes.func
  }

  constructor () {
    super()
    this.state = {
      step: STEP_SELECT_NETWORK,
      isSaveKey: true
    }
  }

  componentWillReceiveProps (nextProps) {
    const { selectedNetworkId, selectedProviderId } = nextProps

    if (isProviderOrNetworkChanded(this.props, nextProps)) {
      this.hasStoredKey(selectedProviderId, selectedNetworkId)
    }
  }

  setupAndLogin ({ ethereum, bitcoin }) {

    // setup
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(ethereum)

    // login
    this.props.loadAccounts().then(() => {
      this.props.selectAccount(this.props.accounts[0])
      bccProvider.setEngine(bcc)
      btcProvider.setEngine(btc)
      this.props.onLogin()
    }).catch((e) => {
      this.props.addError(e.message)
    })
  }

  handleMnemonicLogin = (mnemonicKey) => {
    this.props.loading()
    this.props.clearErrors()

    if (window.isMobile) {
      this.setKey(getPrivateKeyFromMnemonic(mnemonicKey))
      return
    }
    
    const provider = mnemonicProvider(mnemonicKey, this.props.getProviderSettings())

    this.setupAndLogin(provider)
  }

  handlePrivateKeyLogin = (privateKey) => {
    this.props.loading()
    this.props.clearErrors()
    try {
      if (window.isMobile) {
        this.setKey(privateKey)
        return
      }

      const provider = privateKeyProvider(privateKey, this.props.getProviderSettings())

      this.setupAndLogin(provider)
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleLedgerLogin = () => {
    this.props.loading()
    this.props.clearErrors()
    try {
      ledgerProvider.setupAndStart(this.props.getProviderURL())
      web3Provider.setWeb3(ledgerProvider.getWeb3())
      web3Provider.setProvider(ledgerProvider.getProvider())
      this.props.onLogin()
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleWalletUpload = (wallet, password) => {
    this.props.loading()
    this.props.clearErrors()
    try {
      if (window.isMobile) {
        this.setKey(getPrivateKeyFromWallet(wallet, password))
        return
      }

      const provider = walletProvider(wallet, password, this.props.getProviderSettings())

      this.setupAndLogin(provider)
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleSelectNetwork = () => {
    this.props.clearErrors()
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(web3Utils.createStatusEngine(this.props.getProviderURL()))
    web3Provider.resolve()
    if (this.state.step === STEP_SELECT_NETWORK) {
      this.setStep(STEP_SELECT_OPTION)
    }
  }

  handleChangeOption (newOption) {
    this.props.clearErrors()
    this.setStep(newOption)
  }

  setStep (step) {
    this.setState({step})
    this.handleToggleProvider(step)
  }

  handleToggleProvider (step) {
    this.props.onToggleProvider(step !== STEP_GENERATE_WALLET && step !== STEP_GENERATE_MNEMONIC)
  }

  hasStoredKey = async (provider, network) => {
    const { hasKey } = await connectReactNative.postMessage('hasKey', {
      provider, network
    })

    this.setState({ hasKey })
  }
  
  handlePinCodeLogin = async (pinCode) => {
    this.props.clearErrors()

    try {
      const { key, error } = await connectReactNative.postMessage('getKey', {
        pinCode,
        provider: this.props.selectedProviderId,
        network: this.props.selectedNetworkId
      })

      if (error || !key) {
        this.props.addError(error)
        return
      }

      const provider = privateKeyProvider(key, this.props.getProviderSettings())
      
      this.setupAndLogin(provider)
    }
    catch (e) {
      this.props.addError(e.message)
    }
  }

  handlePinCodeSet = async (nextPinCode) => {
    const { pinCode, privateKey } = this.state

    if (pinCode) {
      if (pinCode === nextPinCode) {
        this.setState({ pinCode: '' })
        
        await connectReactNative.postMessage('setPinCode', {
          pinCode
        })

        this.addKey(privateKey)
        return
      }
      this.props.addError('Pin-codes do not match')
    }

    this.setState({ pinCode: nextPinCode })
  }

  handleBackToOptions = () => {
    const { selectedProviderId, selectedNetworkId } = this.props

    this.hasStoredKey(selectedProviderId, selectedNetworkId)
    this.handleChangeOption(STEP_SELECT_OPTION)
  }

  setKey = (privateKey) => {
    this.setStep(STEP_SET_PINCODE)
    this.setState({ privateKey })
  }

  addKey = async (key) => {
    this.setState({ step: STEP_SET_PINCODE })
    
    const { error } = await connectReactNative.postMessage('addKey', {
      key,
      provider: this.props.selectedProviderId,
      network: this.props.selectedNetworkId
    })

    if (error) {
      this.props.addError(error)
      return
    }

    this.handleBackToOptions()
  }

  renderOptions () {
    const byDevice = filterByDevice(window.isMobile ? 'mobile' : 'desktop')
    
    return loginOptions.filter(byDevice).map((item, id) => (
      <div
        key={id}
        styleName='optionBox'
        onTouchTap={() => this.handleChangeOption(item.nextStep)}
      >
        <div styleName='optionName'><Translate value={item.title}/></div>
        <div className='material-icons' styleName='arrow'>arrow_forward</div>
      </div>
    ))
  }

  render () {
    const {selectedNetworkId} = this.props
    const {step, storedWallet, hasKey, pinCode } = this.state

    const isNetworkSelector = step !== STEP_GENERATE_WALLET && step !== STEP_GENERATE_MNEMONIC
    const isGenerateMnemonic = step === STEP_GENERATE_MNEMONIC
    const isPinCode = window.isMobile && hasKey && step === STEP_SELECT_OPTION
    const isPinCodeSetFirst = step === STEP_SET_PINCODE && !pinCode
    const isPinCodeSetSecond = step === STEP_SET_PINCODE && pinCode

    return (
      <div>
        {isNetworkSelector && <NetworkSelector onSelect={this.handleSelectNetwork} />}
        { isPinCode && (
          <LoginWithPinCode
            onLogin={this.handlePinCodeLogin}
            label='Enter pin code or touch a fingerprint scanner:'
          />
        )}
        { isPinCodeSetFirst && (
          <LoginWithPinCode
            onLogin={this.handlePinCodeSet}
            label='Enter pin-code. Warning! Your previous wallet and pin will be overwritten!'
          />
        ) }
        { isPinCodeSetSecond && (
          <LoginWithPinCode
            onLogin={this.handlePinCodeSet}
            label='Reenter your new pin-code. Warning! Your previous wallet and pin will be overwritten!'
          />
        ) }
        {step === STEP_SELECT_OPTION && !!selectedNetworkId && (
          <div>
            <NetworkStatus />
            <div styleName='optionTitle'>{<Translate value='LoginWithOptions.selectLoginOption'/>}</div>
            <div>{this.renderOptions()}</div>
          </div>
        )}

        {step === STEP_LOGIN_WITH_MNEMONIC && (
          <LoginWithMnemonic
            onLogin={this.handleMnemonicLogin}
            onGenerate={() => this.handleChangeOption(STEP_GENERATE_MNEMONIC)}
            onBack={() => this.handleChangeOption(STEP_SELECT_OPTION)}
            onSaveKeyCheck={this.handleSaveKeyCheck}
            isSaveKey={this.state.isSa}
          />
        )}

        {step === STEP_LOGIN_WITH_WALLET && (
          <LoginWithWallet
            onLogin={this.handleWalletUpload}
            wallet={storedWallet}
            onBack={() => this.handleChangeOption(STEP_SELECT_OPTION)}
            onGenerate={() => this.handleChangeOption(STEP_GENERATE_WALLET)}
          />
        )}
        {step === STEP_LOGIN_WITH_PRIVATE_KEY && (
          <LoginWithPrivateKey
            onLogin={this.handlePrivateKeyLogin}
            onBack={() => this.handleChangeOption(STEP_SELECT_OPTION)}
          />
        )}

        {step === STEP_GENERATE_WALLET && (
          <GenerateWallet
            onBackToOptions={this.handleBackToOptions}
            onBack={() => this.handleChangeOption(STEP_LOGIN_WITH_WALLET)}
          />
        )}
        {isGenerateMnemonic && (
          <GenerateMnemonic
            onBack={() => this.handleChangeOption(STEP_LOGIN_WITH_MNEMONIC)}
          />
        )}
        {step === STEP_LOGIN_WITH_LEDGER && (
          <LoginLedger
            onLogin={this.handleLedgerLogin}
            onBack={() => this.handleChangeOption(STEP_SELECT_OPTION)}
          />
        )}
      </div>
    )
  }
}

export default LoginWithOptions
