import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import LoginMnemonic from './LoginMnemonic'
import GenerateMnemonic from './GenerateMnemonic'
import Web3 from 'web3'
import web3Provider from '../../../network/Web3Provider'
import mnemonicProvider from '../../../network/mnemonicProvider'
import { getNetworkById, providerMap } from '../../../network/settings'
import NetworkSelector from './NetworkSelector'
import styles from './styles'
import walletProvider from '../../../network/walletProvider'
import LoginUploadWallet from './LoginUploadWallet'
import { addError, clearErrors, loadAccounts, selectAccount } from '../../../redux/network/actions'
import GenerateWallet from './GenerateWallet'

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
      isMnemonicLoading: false
    }
  }

  componentWillReceiveProps (props) {
    if (props.isError) {
      this.setState({isMnemonicLoading: false})
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

  handleMnemonicLogin = (mnemonicKey) => {
    this.props.clearErrors()
    this.setState({isMnemonicLoading: true})

    const {protocol, host} = getNetworkById(
      this.props.selectedNetworkId,
      providerMap.infura.id,
      this.props.isLocal
    )
    const providerUrl = protocol ? `${protocol}://${host}` : `//${host}`
    const provider = mnemonicProvider(mnemonicKey, providerUrl)
    this.setupWeb3AndLogin(provider)
  }

  handleWalletUpload = (wallet, password) => {
    this.props.clearErrors()
    const {protocol, host} = getNetworkById(
      this.props.selectedNetworkId,
      providerMap.infura.id,
      this.props.isLocal
    )
    const providerUrl = protocol ? `${protocol}://${host}` : `//${host}`
    try {
      const provider = walletProvider(wallet, password, providerUrl)
      this.setupWeb3AndLogin(provider)
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleUploadWallet = () => {
    this.props.clearErrors()
    this.setState({step: STEP_WALLET_PASSWORD})
  }

  handleGenerateMnemonicClick = () => {
    this.props.clearErrors()
    this.setState({step: STEP_GENERATE_MNEMONIC})
  }

  handleGenerateWalletClick = () => {
    this.props.clearErrors()
    this.setState({step: STEP_GENERATE_WALLET})
  }

  handleSelectNetwork = () => {
    this.props.clearErrors()
    if (this.state.step === STEP_SELECT_NETWORK) {
      this.setState({step: STEP_SELECT_OPTION})
    }
  }

  handleBackClick = () => {
    this.props.clearErrors()
    this.setState({step: STEP_SELECT_OPTION})
  }

  render () {
    const {selectedNetworkId} = this.props
    const {step, isMnemonicLoading} = this.state
    const isWalletOption = step === STEP_SELECT_OPTION || step === STEP_WALLET_PASSWORD
    const isMnemonicOption = step === STEP_SELECT_OPTION && selectedNetworkId
    const isGenerateMnemonic = step === STEP_SELECT_OPTION || step === STEP_GENERATE_MNEMONIC
    const isGenerateWallet = step === STEP_SELECT_OPTION || step === STEP_GENERATE_WALLET
    return (
      <div>
        {<NetworkSelector onSelect={this.handleSelectNetwork} />}
        {isMnemonicOption && <LoginMnemonic
          isLoading={isMnemonicLoading}
          onLogin={this.handleMnemonicLogin} />}
        {isMnemonicOption && <div style={styles.or}>OR</div>}
        {isWalletOption &&
        <LoginUploadWallet
          step={step}
          isLoading={isMnemonicLoading}
          onBack={this.handleBackClick}
          onUpload={this.handleUploadWallet}
          onLogin={this.handleWalletUpload} />}
        {isGenerateMnemonic && <GenerateMnemonic
          isLoading={isMnemonicLoading}
          step={step}
          onBack={this.handleBackClick}
          onClick={this.handleGenerateMnemonicClick} />}
        {isGenerateWallet && <GenerateWallet
          isLoading={isMnemonicLoading}
          step={step}
          onBack={this.handleBackClick}
          onClick={this.handleGenerateWalletClick} />}
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
  isLocal: PropTypes.bool
}

export default LoginInfura
