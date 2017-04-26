import React, { Component } from 'react'
import {connect} from 'react-redux'
import { addError, selectNetwork } from '../../../redux/network/networkAction'
import AccountSelector from './AccountSelector'
import { getNetworkById, networkMap } from '../../../network/networkSettings'
import { TextField } from 'material-ui'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId
})

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  selectNetwork: (networkId) => dispatch(selectNetwork(networkId))
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginMetamask extends Component {
  componentWillMount () {
    window.web3.version.getNetwork((error, currentNetworkId) => {
      if (error) {
        this.props.addError('Something wrong with MetaMask')
      }
      this.props.selectNetwork(Math.min(+currentNetworkId, networkMap.local.id))
    })
  }

  render () {
    const { selectedNetworkId } = this.props
    const name = getNetworkById(selectedNetworkId).name || 'Not defined'
    return (
      <div>
        <TextField
          floatingLabelText="Network"
          value={name}
          disabled
          fullWidth
        />
        <AccountSelector onSelectAccount={() => this.props.onLogin()} />
      </div>
    )
  }
}

export default LoginMetamask
