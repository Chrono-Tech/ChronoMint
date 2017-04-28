import React, { Component } from 'react'
import {connect} from 'react-redux'
import { addError, loadAccounts, selectNetwork } from '../../../redux/network/actions'
import AccountSelector from './AccountSelector'
import { getNetworkById, LOCAL_ID, providerMap } from '../../../network/networkSettings'
import { TextField } from 'material-ui'
import web3Provider from '../../../network/Web3Provider'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  providers: state.get('network').providers
})

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  selectNetwork: (networkId) => dispatch(selectNetwork(networkId)),
  loadAccounts: () => dispatch(loadAccounts())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginMetamask extends Component {
  componentWillMount () {
    web3Provider.setWeb3(window.web3)
    web3Provider.setProvider(window.web3.currentProvider)
    window.web3.version.getNetwork((error, currentNetworkId) => {
      if (error) {
        this.props.addError('Something wrong with MetaMask')
      }
      this.props.selectNetwork(Math.min(+currentNetworkId, LOCAL_ID))
    })
    this.props.loadAccounts()
  }

  render () {
    const { selectedNetworkId } = this.props
    const name = getNetworkById(selectedNetworkId, providerMap.metamask.id).name || 'Not defined'
    return (
      <div>
        <TextField
          floatingLabelText='Network'
          value={name}
          fullWidth
        />
        <AccountSelector onSelectAccount={() => this.props.onLogin()} />
      </div>
    )
  }
}

export default LoginMetamask
