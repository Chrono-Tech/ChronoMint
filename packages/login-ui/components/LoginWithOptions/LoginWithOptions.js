import ledgerProvider from '@chronobank/login/network/LedgerProvider'
import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'
import networkService from '@chronobank/login/network/NetworkService'
import privateKeyProvider from '@chronobank/login/network/privateKeyProvider'
import { LOCAL_PRIVATE_KEYS } from '@chronobank/login/network/settings'
import trezorProvider from '@chronobank/login/network/TrezorProvider'
import walletProvider from '@chronobank/login/network/walletProvider'
import web3Provider from '@chronobank/login/network/Web3Provider'
import { loginLedger } from '@chronobank/login/redux/ledger/actions'
import { addError, clearErrors, loading, setCanExportPK } from '@chronobank/login/redux/network/actions'
import { loginTrezor } from '@chronobank/login/redux/trezor/actions'
import pascalCase from 'pascal-case'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import GenerateMnemonic from '../../components/GenerateMnemonic/GenerateMnemonic'
import GenerateWallet from '../../components/GenerateWallet/GenerateWallet'
import LoginLocal from '../../components/LoginLocal/LoginLocal'
import LoginMetamask from '../../components/LoginMetamask/LoginMetamask'
import LoginUPort from '../../components/LoginUPort/LoginUPort'
import LoginLedger from '../../components/LoginWithLedger/LoginWithLedger'
import LoginWithMnemonic from '../../components/LoginWithMnemonic/LoginWithMnemonic'
import LoginWithPrivateKey from '../../components/LoginWithPrivateKey/LoginWithPrivateKey'
import LoginTrezor from '../../components/LoginWithTrezor/LoginWithTrezor'
import LoginWithWallet from '../../components/LoginWithWallet/LoginWithWallet'

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
const STEP_LOGIN_WITH_UPORT = 'step/LOGIN_WITH_UPORT'
const STEP_LOGIN_LOCAL = 'step/LOGIN_LOCAL'

const T = () => true

const checkStep = (currentStep) =>
  currentStep === STEP_LOGIN_WITH_MNEMONIC || currentStep === STEP_LOGIN_WITH_WALLET || currentStep === STEP_LOGIN_WITH_PRIVATE_KEY

const loginOptions = [
  {
    nextStep: STEP_LOGIN_WITH_MNEMONIC,
    title: 'LoginWithOptions.mnemonicKey',
    showOption: T,
  },
  {
    nextStep: STEP_LOGIN_WITH_WALLET,
    title: 'LoginWithOptions.walletFile',
    showOption: T,
  },
  {
    nextStep: STEP_LOGIN_WITH_PRIVATE_KEY,
    title: 'LoginWithOptions.privateKey',
    showOption: T,
  },
  {
    nextStep: STEP_LOGIN_WITH_LEDGER,
    title: 'LoginWithOptions.ledgerNano',
    showOption: T,
  },
  {
    nextStep: STEP_LOGIN_WITH_TREZOR,
    title: 'LoginWithOptions.trezor',
    showOption: T,
  },
  {
    nextStep: STEP_LOGIN_WITH_METAMASK,
    title: 'LoginWithOptions.metamask',
    showOption: ({ isMetamask }) => isMetamask,
  },
  {
    nextStep: STEP_LOGIN_WITH_UPORT,
    title: 'LoginWithOptions.uport',
    showOption: T,
  },
  {
    nextStep: STEP_LOGIN_LOCAL,
    title: 'LoginWithOptions.local',
    showOption: ({ isLocal }) => isLocal,
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
  isLocal: state.get('network').isLocal,
  isMetamask: state.get('network').isMetamask,
})

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  clearErrors: () => dispatch(clearErrors()),
  loading: () => dispatch(loading()),
  loginLedger: () => loginLedger(),
  loginTrezor: () => loginTrezor(),
  setCanExportPK: (canExport) => dispatch(setCanExportPK(canExport)),
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginWithOptions extends PureComponent {
  static propTypes = {
    isLocal: PropTypes.bool,
    isMetamask: PropTypes.bool,
    accounts: PropTypes.arrayOf(PropTypes.string),
    onLogin: PropTypes.func,
    addError: PropTypes.func,
    clearErrors: PropTypes.func,
    onToggleProvider: PropTypes.func,
    selectedNetworkId: PropTypes.number,
    loading: PropTypes.func,
    loginLedger: PropTypes.func,
    loginTrezor: PropTypes.func,
    setCanExportPK: PropTypes.func,
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
    const provider = mnemonicProvider.getMnemonicProvider(mnemonicKey, networkService.getProviderSettings())
    this.setupAndLogin(provider)
  }

  handlePrivateKeyLogin = (privateKey) => {
    this.props.loading()
    this.props.clearErrors()
    try {
      const provider = privateKeyProvider.getPrivateKeyProvider(privateKey, networkService.getProviderSettings())
      this.setupAndLogin(provider)
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleLoginLocal = (account) => {
    this.props.clearErrors()
    try {
      const index = Math.max(this.props.accounts.indexOf(account), 0)
      const provider = privateKeyProvider.getPrivateKeyProvider(LOCAL_PRIVATE_KEYS[index], networkService.getProviderSettings())
      this.setupAndLogin(provider)
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleLedgerLogin = () => {
    this.props.loading()
    this.props.clearErrors()
    try {
      ledgerProvider.setupAndStart(networkService.getProviderURL())
      web3Provider.reinit(ledgerProvider.getWeb3(), ledgerProvider.getProvider())
      this.props.onLogin()
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleTrezorLogin = () => {
    this.props.loading()
    this.props.clearErrors()
    try {
      trezorProvider.setupAndStart(networkService.getProviderURL())
      web3Provider.reinit(trezorProvider.getWeb3(), trezorProvider.getProvider())
      this.props.onLogin()
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleWalletUpload = (wallet, password) => {
    this.props.loading()
    this.props.clearErrors()
    try {
      const provider = walletProvider.getProvider(wallet, password, networkService.getProviderSettings())
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

  async setupAndLogin (provider) {
    try {
      await networkService.setup(provider)
      this.props.setCanExportPK(checkStep(this.state.step))
      this.props.onLogin()
    } catch (e) {
      // eslint-disable-next-line
      console.error('login error', e.message)
    }
  }

  setStep (step) {
    this.setState({ step })
    this.handleToggleProvider(step)
  }

  checkOption = (option) => {
    return option.showOption(this.props)
  }

  renderOption = (option) => (
    <LoginOption
      key={option.title}
      option={option}
      onClick={this.handleChangeOption}
    />
  )

  renderOptions () {
    return loginOptions
      .filter(this.checkOption)
      .map(this.renderOption)
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

  renderStepLoginWithUport () {
    return (
      <LoginUPort
        onLogin={this.props.onLogin}
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
        onLogin={this.handleLoginLocal}
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
