import networkService from '@chronobank/login/network/NetworkService'
import { LOCAL_ID, TESTRPC_URL, LOCAL_PROVIDER_ID } from '@chronobank/login/network/settings'
import web3Provider from '@chronobank/login/network/Web3Provider'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Web3 from 'web3'
import AccountSelector from '../../components/AccountSelector/AccountSelector'
import BackButton from '../../components/BackButton/BackButton'

const mapDispatchToProps = () => ({
  selectNetwork: (networkId) => networkService.selectNetwork(networkId),
  selectProvider: (id) => networkService.selectProvider(id),
})

@connect(null, mapDispatchToProps)
class LoginLocal extends PureComponent {
  static propTypes = {
    selectNetwork: PropTypes.func,
    onLogin: PropTypes.func,
    onBack: PropTypes.func.isRequired,
    selectProvider: PropTypes.func,
  }

  componentWillMount () {
    const web3 = new Web3()
    web3Provider.reinit(web3, new web3.providers.HttpProvider(TESTRPC_URL))
  }

  handleSelectAccount = (account) => {
    this.props.selectProvider(LOCAL_PROVIDER_ID)
    this.props.selectNetwork(LOCAL_ID)
    this.props.onLogin(account)
  }

  render () {
    return (
      <div>
        <BackButton
          onClick={this.props.onBack}
          to='options'
        />
        <AccountSelector onSelectAccount={this.handleSelectAccount} />
      </div>
    )
  }
}

export default LoginLocal
