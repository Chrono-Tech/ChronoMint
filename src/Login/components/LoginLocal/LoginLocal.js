import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Web3 from 'web3'
import { connect } from 'react-redux'
import AccountSelector from '../../components/AccountSelector/AccountSelector'
import { LOCAL_ID } from '../../network/settings'
import networkService from '../../redux/network/actions'
import web3Provider from '../../network/Web3Provider'

const mapDispatchToProps = () => ({
  selectNetwork: (networkId) => networkService.selectNetwork(networkId),
})

@connect(null, mapDispatchToProps)
class LoginLocal extends PureComponent {
  componentWillMount () {
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(new web3.providers.HttpProvider(`//${location.hostname}:8545`))
  }

  handleSelectAccount = () => {
    this.props.selectNetwork(LOCAL_ID)
    this.props.onLogin()
  }

  render () {
    return <AccountSelector onSelectAccount={this.handleSelectAccount} />
  }
}

LoginLocal.propTypes = {
  selectNetwork: PropTypes.func,
  onLogin: PropTypes.func,
}

export default LoginLocal
