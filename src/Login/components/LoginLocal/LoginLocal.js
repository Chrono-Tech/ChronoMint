import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Web3 from 'web3'
import AccountSelector from '../../components/AccountSelector/AccountSelector'
import BackButton from '../../components/BackButton/BackButton'
import { LOCAL_ID, TESTRPC_URL } from '../../network/settings'
import web3Provider from '../../network/Web3Provider'
import networkService from '../../redux/network/actions'

const mapDispatchToProps = () => ({
  selectNetwork: (networkId) => networkService.selectNetwork(networkId),
})

@connect(null, mapDispatchToProps)
class LoginLocal extends PureComponent {
  static propTypes = {
    selectNetwork: PropTypes.func,
    onLogin: PropTypes.func,
    onBack: PropTypes.func.isRequired,
  }

  componentWillMount () {
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(new web3.providers.HttpProvider(TESTRPC_URL))
  }

  handleSelectAccount = () => {
    this.props.selectNetwork(LOCAL_ID)
    this.props.onLogin()
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
