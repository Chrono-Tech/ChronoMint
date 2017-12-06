import { bccProvider, btcProvider } from 'Login/network/BitcoinProvider'
import { ethereumProvider } from 'Login/network/EthereumProvider'
import { nemProvider } from 'Login/network/NemProvider'
import privateKeyProvider from 'Login/network/privateKeyProvider'
import networkService, { addError } from 'Login/redux/network/actions'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Web3 from 'web3'
import AccountSelector from '../../components/AccountSelector/AccountSelector'
import BackButton from '../../components/BackButton/BackButton'
import { LOCAL_ID, TESTRPC_URL, LOCAL_PROVIDER_ID } from '../../network/settings'
import web3Provider from '../../network/Web3Provider'

const mapStateToProps = (state) => ({
  accounts: state.get('network').accounts,
})

const mapDispatchToProps = (dispatch) => ({
  selectNetwork: (networkId) => networkService.selectNetwork(networkId),
  selectProvider: (id) => networkService.selectProvider(id),
  getProviderSettings: () => networkService.getProviderSettings(),
  selectAccount: (value) => networkService.selectAccount(value),
  loadAccounts: () => networkService.loadAccounts(),
  addError: (error) => dispatch(addError(error)),
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginLocal extends PureComponent {
  static propTypes = {
    selectNetwork: PropTypes.func,
    onLogin: PropTypes.func,
    onBack: PropTypes.func.isRequired,
    loadAccounts: PropTypes.func,
    selectAccount: PropTypes.func,
    selectProvider: PropTypes.func,
    addError: PropTypes.func,
    getProviderSettings: PropTypes.func,
    accounts: PropTypes.arrayOf(PropTypes.string),
  }

  componentWillMount () {
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(new web3.providers.HttpProvider(TESTRPC_URL))
  }

  async handleSelectAccount () {
    this.props.selectProvider(LOCAL_PROVIDER_ID)
    this.props.selectNetwork(LOCAL_ID)

    // TODO @dkchv: hardcoded until MINT-855

    const provider = privateKeyProvider.getPrivateKeyProvider(
      '67c4982b268a058cfea01621d11d6d785abc467719624e9f2d10d12e4f47bf85',
      this.props.getProviderSettings()
    )
    await this.setupAndLogin(provider)
    this.props.onLogin()
  }

  async setupAndLogin ({ ethereum, btc, bcc, nem }) {
    // setup
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(ethereum.getProvider())

    // login
    try {
      await this.props.loadAccounts()
      this.props.selectAccount(this.props.accounts[0])
      ethereumProvider.setEngine(ethereum, nem)
      bccProvider.setEngine(bcc)
      btcProvider.setEngine(btc)
      nemProvider.setEngine(nem)
      this.props.onLogin()
    } catch (e) {
      // eslint-disable-next-line
      console.error('error', e.message)
      this.props.addError(e.message)
    }
  }

  render () {
    return (
      <div>
        <BackButton
          onClick={this.props.onBack}
          to='options'
        />
        <AccountSelector onSelectAccount={() => this.handleSelectAccount()} />
      </div>
    )
  }
}

export default LoginLocal
