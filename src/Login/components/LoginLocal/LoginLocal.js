import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Web3 from 'web3'
import { connect } from 'react-redux'
import web3Provider from 'Login/network/Web3Provider'
import { LOCAL_ID } from 'Login/network/settings'
import AccountSelector from 'Login/components/AccountSelector/AccountSelector'
import networkService from 'Login/redux/network/actions'

const mapDispatchToProps = () => ({
  selectNetwork: networkId => networkService.selectNetwork(networkId),
})

@connect(null, mapDispatchToProps)
class LoginLocal extends Component {
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
