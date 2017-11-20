import pascalCase from 'pascal-case'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Web3 from 'web3'
import GenerateMnemonic from '../../components/GenerateMnemonic/GenerateMnemonic'
import GenerateWallet from '../../components/GenerateWallet/GenerateWallet'
import LoginLocal from '../../components/LoginLocal/LoginLocal'
import LoginMetamask from '../../components/LoginMetamask/LoginMetamask'
import LoginLedger from '../../components/LoginWithLedger/LoginWithLedger'
import LoginWithMnemonic from '../../components/LoginWithMnemonic/LoginWithMnemonic'
import LoginWithPrivateKey from '../../components/LoginWithPrivateKey/LoginWithPrivateKey'
import LoginTrezor from '../../components/LoginWithTrezor/LoginWithTrezor'
import LoginWithWallet from '../../components/LoginWithWallet/LoginWithWallet'
import { bccProvider, btcProvider } from '../../network/BitcoinProvider'
import ledgerProvider from '../../network/LedgerProvider'
import mnemonicProvider from '../../network/mnemonicProvider'
import { nemProvider } from '../../network/NemProvider'
import privateKeyProvider from '../../network/privateKeyProvider'
import trezorProvider from '../../network/TrezorProvider'
import walletProvider from '../../network/walletProvider'
import web3Provider from '../../network/Web3Provider'
import { loginLedger } from '../../redux/ledger/actions'
import networkService, { addError, clearErrors, loading } from '../../redux/network/actions'
import { loginTrezor } from '../../redux/trezor/actions'

import './LoginWithOptions.scss'

export const STEP_SELECT_OPTION = 'step/SELECT_OPTION'
export const STEP_GENERATE_WALLET = 'step/GENERATE_WALLET'
export const STEP_GENERATE_MNEMONIC = 'step/GENERATE_MNEMONIC'
export const STEP_LOGIN_WITH_MNEMONIC = 'step/LOGIN_WITH_MNEMONIC'

const STEP_LOGIN_WITH_WALLET = 'step/LOGIN_WITH_WALLET'
const STEP_LOGIN_WITH_PRIVATE_KEY = 'step/LOGIN_WITH_PRIVATE_KEY'
const STEP_LOGIN_WITH_LEDGER = 'step/LOGIN_WITH_LEDGER'
const STEP_LOGIN_WITH_TREZOR = 'step/LOGIN_WITH_TREZOR'
const STEP_LOGIN_WITH_METAMASK = 'step/LOGIN_WITH_METAMASK'
const STEP_LOGIN_LOCAL = 'step/LOGIN_LOCAL'

const loginOptions = [
  {
    nextStep: STEP_LOGIN_WITH_MNEMONIC,
    title: 'LoginWithOptions.mnemonicKey',
  },
  {
    nextStep: STEP_LOGIN_WITH_WALLET,
    title: 'LoginWithOptions.walletFile',
  },
  {
    nextStep: STEP_LOGIN_WITH_PRIVATE_KEY,
    title: 'LoginWithOptions.privateKey',
  },
  {
    nextStep: STEP_LOGIN_WITH_LEDGER,
    title: 'LoginWithOptions.ledgerNano',
  },
  {
    nextStep: STEP_LOGIN_WITH_TREZOR,
    title: 'LoginWithOptions.trezor',
  },
  {
    nextStep: STEP_LOGIN_WITH_METAMASK,
    title: 'LoginWithOptions.metamask',
  },
  {
    nextStep: STEP_LOGIN_LOCAL,
    title: 'LoginWithOptions.local',
  },
]

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
  loginTrezor: () => loginTrezor(),
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
    loginTrezor: PropTypes.func,
  }

  constructor (props, context, updater) {
    super(props, context, updater)
    this.state = {
      step: STEP_SELECT_OPTION,
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

  handleTrezorLogin = () => {
    this.props.loading()
    this.props.clearErrors()
    try {
      trezorProvider.setupAndStart(this.props.getProviderURL())
      web3Provider.setWeb3(trezorProvider.getWeb3())
      web3Provider.setProvider(trezorProvider.getProvider())
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
      this.props.selectAccount(this.props.accounts[ 0 ])
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

  renderStep (step) {
    const renderer = `render${pascalCase(step)}`
    return this[ renderer ] ? this[ renderer ]() : null
  }

  renderStepSelectOption () {
    const { selectedNetworkId } = this.props

    if (!selectedNetworkId) {
      return null
    }

    return (
      <div>
        <div styleName='optionTitle'>{<Translate value='LoginWithOptions.selectLoginOption' />}</div>
        <div>{this.renderOptions()}</div>
      </div>
    )
  }

  renderStepLoginWithMnemonic () {
    return (
      <LoginWithMnemonic
        onLogin={this.handleMnemonicLogin}
        onGenerate={this.handleSelectStepGenerateMnemonic}
        onBack={this.handleSelectStepSelectOption}
      />
    )
  }

  renderStepLoginWithWallet () {
    return (
      <LoginWithWallet
        onLogin={this.handleWalletUpload}
        onBack={this.handleSelectStepSelectOption}
        onGenerate={this.handleSelectStepGenerateWallet}
      />
    )
  }

  renderStepLoginWithPrivateKey () {
    return (
      <LoginWithPrivateKey
        onLogin={this.handlePrivateKeyLogin}
        onBack={this.handleSelectStepSelectOption}
      />
    )
  }

  renderStepGenerateWallet () {
    return (
      <GenerateWallet
        onBack={this.handleSelectStepLoginWithWallet}
      />
    )
  }

  renderStepGenerateMnemonic () {
    return (
      <GenerateMnemonic
        onBack={this.handleSelectStepLoginWithMnemonic}
      />
    )
  }

  renderStepLoginWithLedger () {
    return (
      <LoginLedger
        onLogin={this.handleLedgerLogin}
        onBack={this.handleSelectStepSelectOption}
      />
    )
  }

  renderStepLoginWithTrezor () {
    return (
      <LoginTrezor
        onLogin={this.handleTrezorLogin}
        onBack={this.handleSelectStepSelectOption}
      />
    )
  }

  renderStepLoginWithMetamask () {
    return (
      <LoginMetamask
        onLogin={this.props.onLogin}
        onBack={this.handleSelectStepSelectOption}
      />
    )
  }

  renderStepLoginLocal () {
    return (
      <LoginLocal
        onLogin={this.props.onLogin}
        onBack={this.handleSelectStepSelectOption}
      />
    )
  }

  render () {
    const { step } = this.state

    return (
      <div>
        {this.renderStep(step)}
      </div>
    )
  }
}

export default LoginWithOptions
