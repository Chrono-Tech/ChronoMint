import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Web3 from 'web3'
import { Translate } from 'react-redux-i18n'
import web3Provider from 'network/Web3Provider'
import web3Utils from 'network/Web3Utils'
import bitcoinProvider from 'network/BitcoinProvider'
import mnemonicProvider  from 'network/mnemonicProvider'
import privateKeyProvider from 'network/privateKeyProvider'
import walletProvider from 'network/walletProvider'
import ledgerProvider from 'network/LedgerProvider'
import NetworkService, { addError, clearErrors, loading } from 'redux/network/actions'
import { loginLedger } from 'redux/ledger/actions'
import GenerateMnemonic from 'Login/components/GenerateMnemonic/GenerateMnemonic'
import GenerateWallet from 'Login/components/GenerateWallet/GenerateWallet'
import NetworkSelector from 'Login/components/NetworkSelector/NetworkSelector'
import NetworkStatus from 'Login/components/NetworkStatus/NetworkStatus'
import LoginWithPrivateKey from 'Login/components/LoginWithPrivateKey/LoginWithPrivateKey'
import LoginLedger from 'Login/components/LoginWithLedger/LoginWithLedger'
import LoginWithMnemonic from 'Login/components/LoginWithMnemonic/LoginWithMnemonic'
import LoginWithWallet from 'Login/components/LoginWithWallet/LoginWithWallet'
import './LoginWithOptions.scss'

export const STEP_SELECT_OPTION = 'step/SELECT_OPTION'
export const STEP_GENERATE_WALLET = 'step/GENERATE_WALLET'
export const STEP_GENERATE_MNEMONIC = 'step/GENERATE_MNEMONIC'
export const STEP_LOGIN_WITH_MNEMONIC = 'step/LOGIN_WITH_MNEMONIC'

const STEP_SELECT_NETWORK = 'step/SELECT_NETWORK'
const STEP_LOGIN_WITH_WALLET = 'step/LOGIN_WITH_WALLET'
const STEP_LOGIN_WITH_PRIVATE_KEY = 'step/LOGIN_WITH_PRIVATE_KEY'
const STEP_LOGIN_WITH_LEDGER = 'step/LOGIN_WITH_LEDGER'

const loginOptions = [{
  nextStep: STEP_LOGIN_WITH_MNEMONIC,
  title: 'LoginWithOptions.mnemonicKey'
}, {
  nextStep: STEP_LOGIN_WITH_WALLET,
  title: 'LoginWithOptions.walletFile'
}, {
  nextStep: STEP_LOGIN_WITH_PRIVATE_KEY,
  title: 'LoginWithOptions.privateKey'
}, {
  nextStep: STEP_LOGIN_WITH_LEDGER,
  title: 'LoginWithOptions.ledgerNano'
}]

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  accounts: state.get('network').accounts
})

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  loadAccounts: () => NetworkService.loadAccounts(),
  selectAccount: (value) => NetworkService.selectAccount(value),
  clearErrors: () => dispatch(clearErrors()),
  getProviderURL: () => NetworkService.getProviderURL(),
  getProviderSettings: () => NetworkService.getProviderSettings(),
  loading: () => dispatch(loading()),
  loginLedger: () => loginLedger()
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
    loading: PropTypes.func,
    loginLedger: PropTypes.func
  }

  constructor () {
    super()
    this.state = {
      step: STEP_SELECT_NETWORK
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
      bitcoinProvider.setEngine(bitcoin)
      this.props.onLogin()
    }).catch((e) => {
      this.props.addError(e.message)
    })
  }

  handleMnemonicLogin = (mnemonicKey) => {
    this.props.loading()
    this.props.clearErrors()
    const provider = mnemonicProvider(mnemonicKey, this.props.getProviderSettings())
    this.setupAndLogin(provider)
  }

  handlePrivateKeyLogin = (privateKey) => {
    this.props.loading()
    this.props.clearErrors()
    try {
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

  renderOptions () {
    return loginOptions.map((item, id) => (
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
    const {step} = this.state

    const isNetworkSelector = step !== STEP_GENERATE_WALLET && step !== STEP_GENERATE_MNEMONIC
    const isGenerateMnemonic = step === STEP_GENERATE_MNEMONIC

    return (
      <div>
        {isNetworkSelector && <NetworkSelector onSelect={this.handleSelectNetwork} />}
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
          />
        )}

        {step === STEP_LOGIN_WITH_WALLET && (
          <LoginWithWallet
            onLogin={this.handleWalletUpload}
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
