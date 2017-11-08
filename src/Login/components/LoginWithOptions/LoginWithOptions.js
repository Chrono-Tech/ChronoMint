import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Web3 from 'web3'
import GenerateMnemonic from '../../components/GenerateMnemonic/GenerateMnemonic'
import GenerateWallet from '../../components/GenerateWallet/GenerateWallet'

import LoginLedger from '../../components/LoginWithLedger/LoginWithLedger'
import LoginWithMnemonic from '../../components/LoginWithMnemonic/LoginWithMnemonic'
import LoginWithPrivateKey from '../../components/LoginWithPrivateKey/LoginWithPrivateKey'
import LoginWithWallet from '../../components/LoginWithWallet/LoginWithWallet'
import NetworkSelector from '../../components/NetworkSelector/NetworkSelector'
import NetworkStatus from '../../components/NetworkStatus/NetworkStatus'

import { bccProvider, btcProvider } from '../../network/BitcoinProvider'
import { nemProvider } from '../../network/NemProvider'
import ledgerProvider from '../../network/LedgerProvider'
import mnemonicProvider from '../../network/mnemonicProvider'
import privateKeyProvider from '../../network/privateKeyProvider'
import walletProvider from '../../network/walletProvider'
import web3Provider from '../../network/Web3Provider'
import web3Utils from '../../network/Web3Utils'
import { loginLedger } from '../../redux/ledger/actions'
import networkService, { addError, clearErrors, loading } from '../../redux/network/actions'

import './LoginWithOptions.scss'

export const STEP_SELECT_OPTION = 'step/SELECT_OPTION'
export const STEP_GENERATE_WALLET = 'step/GENERATE_WALLET'
export const STEP_GENERATE_MNEMONIC = 'step/GENERATE_MNEMONIC'
export const STEP_LOGIN_WITH_MNEMONIC = 'step/LOGIN_WITH_MNEMONIC'

const STEP_SELECT_NETWORK = 'step/SELECT_NETWORK'
const STEP_LOGIN_WITH_WALLET = 'step/LOGIN_WITH_WALLET'
const STEP_LOGIN_WITH_PRIVATE_KEY = 'step/LOGIN_WITH_PRIVATE_KEY'
const STEP_LOGIN_WITH_LEDGER = 'step/LOGIN_WITH_LEDGER'

const loginOptions = [ {
  nextStep: STEP_LOGIN_WITH_MNEMONIC,
  title: 'LoginWithOptions.mnemonicKey',
}, {
  nextStep: STEP_LOGIN_WITH_WALLET,
  title: 'LoginWithOptions.walletFile',
}, {
  nextStep: STEP_LOGIN_WITH_PRIVATE_KEY,
  title: 'LoginWithOptions.privateKey',
}, {
  nextStep: STEP_LOGIN_WITH_LEDGER,
  title: 'LoginWithOptions.ledgerNano',
} ]

class LoginOption extends PureComponent {
  static propTypes = {
    option: PropTypes.shape({
      title: PropTypes.string.isRequired,
      nextStep: PropTypes.string.isRequired,
    }).isRequired,
    onClick: PropTypes.func,
  }

  handleClick = () => this.props.onClick(this.props.option.nextStep)

  render () {
    return (
      <div
        key={this.props.option.title}
        styleName='optionBox'
        onTouchTap={this.handleClick}
      >
        <div styleName='optionName'><Translate value={this.props.option.title} /></div>
        <div className='material-icons' styleName='arrow'>arrow_forward</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  accounts: state.get('network').accounts,
})

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  loadAccounts: () => networkService.loadAccounts(),
  selectAccount: (value) => networkService.selectAccount(value),
  clearErrors: () => dispatch(clearErrors()),
  getProviderURL: () => networkService.getProviderURL(),
  getProviderSettings: () => networkService.getProviderSettings(),
  loading: () => dispatch(loading()),
  loginLedger: () => loginLedger(),
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginWithOptions extends PureComponent {
  static propTypes = {
    loadAccounts: PropTypes.func,
    accounts: PropTypes.arrayOf(PropTypes.string),
    selectAccount: PropTypes.func,
    getProviderURL: PropTypes.func,
    getProviderSettings: PropTypes.func,
    onLogin: PropTypes.func,
    addError: PropTypes.func,
    clearErrors: PropTypes.func,
    onToggleProvider: PropTypes.func,
    selectedNetworkId: PropTypes.number,
    loading: PropTypes.func,
    loginLedger: PropTypes.func,
  }

  constructor () {
    super()
    this.state = {
      step: STEP_SELECT_NETWORK,
    }
  }

  handleMnemonicLogin = (mnemonicKey) => {
    this.props.loading()
    this.props.clearErrors()
    const provider = mnemonicProvider.getMnemonicProvider(mnemonicKey, this.props.getProviderSettings())
    this.setupAndLogin(provider)
  }

  handlePrivateKeyLogin = (privateKey) => {
    this.props.loading()
    this.props.clearErrors()
    try {
      const provider = privateKeyProvider.getPrivateKeyProvider(privateKey, this.props.getProviderSettings())
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
      const provider = walletProvider.getProvider(wallet, password, this.props.getProviderSettings())
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

  handleChangeOption = (step) => {
    this.props.clearErrors()
    this.setStep(step)
  }

  handleSelectStepSelectOption = () => this.handleChangeOption(STEP_SELECT_OPTION)

  handleSelectStepGenerateWallet = () => this.handleChangeOption(STEP_GENERATE_WALLET)

  handleSelectStepGenerateMnemonic = () => this.handleChangeOption(STEP_GENERATE_MNEMONIC)

  handleSelectStepLoginWithMnemonic = () => this.handleChangeOption(STEP_LOGIN_WITH_MNEMONIC)

  handleSelectStepLoginWithWallet = () => this.handleChangeOption(STEP_LOGIN_WITH_WALLET)

  handleToggleProvider (step) {
    this.props.onToggleProvider(step !== STEP_GENERATE_WALLET && step !== STEP_GENERATE_MNEMONIC)
  }

  setupAndLogin ({ ethereum, btc, bcc, nem }) {
    // setup
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(ethereum)

    // login
    this.props.loadAccounts().then(() => {
      this.props.selectAccount(this.props.accounts[0])
      bccProvider.setEngine(bcc)
      btcProvider.setEngine(btc)
      nemProvider.setEngine(nem)
      this.props.onLogin()
    }).catch((e) => {
      this.props.addError(e.message)
    })
  }

  setStep (step) {
    this.setState({ step })
    this.handleToggleProvider(step)
  }

  renderOption = (option) => (
    <LoginOption
      key={option.title}
      option={option}
      onClick={this.handleChangeOption}
    />
  )

  renderOptions () {
    return loginOptions.map(this.renderOption)
  }

  render () {
    const { selectedNetworkId } = this.props
    const { step } = this.state

    const isNetworkSelector = step !== STEP_GENERATE_WALLET && step !== STEP_GENERATE_MNEMONIC
    const isGenerateMnemonic = step === STEP_GENERATE_MNEMONIC

    return (
      <div>
        {isNetworkSelector && <NetworkSelector onSelect={this.handleSelectNetwork} />}
        {step === STEP_SELECT_OPTION && !!selectedNetworkId && (
          <div>
            <NetworkStatus />
            <div styleName='optionTitle'>{<Translate value='LoginWithOptions.selectLoginOption' />}</div>
            <div>{this.renderOptions()}</div>
          </div>
        )}

        {step === STEP_LOGIN_WITH_MNEMONIC && (
          <LoginWithMnemonic
            onLogin={this.handleMnemonicLogin}
            onGenerate={this.handleSelectStepGenerateMnemonic}
            onBack={this.handleSelectStepSelectOption}
          />
        )}

        {step === STEP_LOGIN_WITH_WALLET && (
          <LoginWithWallet
            onLogin={this.handleWalletUpload}
            onBack={this.handleSelectStepSelectOption}
            onGenerate={this.handleSelectStepGenerateWallet}
          />
        )}
        {step === STEP_LOGIN_WITH_PRIVATE_KEY && (
          <LoginWithPrivateKey
            onLogin={this.handlePrivateKeyLogin}
            onBack={this.handleSelectStepSelectOption}
          />
        )}

        {step === STEP_GENERATE_WALLET && (
          <GenerateWallet
            onBack={this.handleSelectStepLoginWithWallet}
          />
        )}
        {isGenerateMnemonic && (
          <GenerateMnemonic
            onBack={this.handleSelectStepLoginWithMnemonic}
          />
        )}
        {step === STEP_LOGIN_WITH_LEDGER && (
          <LoginLedger
            onLogin={this.handleLedgerLogin}
            onBack={this.handleSelectStepSelectOption}
          />
        )}
      </div>
    )
  }
}

export default LoginWithOptions
