import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoginMnemonic from './LoginMnemonic'
import Web3 from 'web3'
import web3Provider from '../../../network/Web3Provider'
import mnemonicProvider from '../../../network/MnemonicProvider'
import { getNetworkById, providerMap } from '../../../network/networkSettings'
import NetworkSelector from './NetworkSelector'
import styles from './styles'
import walletProvider from '../../../network/WalletProvider'
import LoginUploadWallet from './LoginUploadWallet'
import { addError, loadAccounts, selectAccount } from '../../../redux/network/actions'

const STEP_SELECT_NETWORK = 'step/SELECT_NETWORK'
export const STEP_SELECT_OPTION = 'step/SELECT_OPTION'
export const STEP_WALLET_PASSWORD = 'step/ENTER_WALLET_PASSWORD'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  accounts: state.get('network').accounts,
  isLocal: state.get('network').isLocal
})

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  loadAccounts: () => dispatch(loadAccounts()),
  selectAccount: (value) => dispatch(selectAccount(value))
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginInfura extends Component {
  constructor () {
    super()
    this.state = {
      step: STEP_SELECT_NETWORK
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
    this.setState({step: STEP_WALLET_PASSWORD})
  }

  handleSelectNetwork = () => {
    this.setState({step: STEP_SELECT_OPTION})
  }

  render () {
    const {selectedNetworkId} = this.props
    const {step} = this.state
    const isWalletOption = step === STEP_SELECT_OPTION || step === STEP_WALLET_PASSWORD
    const isMnemonicOption = step === STEP_SELECT_OPTION && selectedNetworkId
    return (
      <div>
        {<NetworkSelector onSelect={this.handleSelectNetwork} />}
        {isMnemonicOption && <LoginMnemonic onLogin={this.handleMnemonicLogin} />}
        {isMnemonicOption && <div style={styles.or}>OR</div>}
        {isWalletOption &&
        <LoginUploadWallet step={step} onUpload={this.handleUploadWallet} onLogin={this.handleWalletUpload} />}
      </div>
    )
  }
}

export default LoginInfura
