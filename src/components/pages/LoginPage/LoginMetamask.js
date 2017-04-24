import React, { Component } from 'react'
import {connect} from 'react-redux'
import { addError } from '../../../redux/network/networkAction'
import AccountSelector from './AccountSelector'
import { networkMap } from '../../../network/networkSettings'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId
})

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error))
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginMetamask extends Component {
  constructor () {
    super()
    this.state = {
      networkMatch: false
    }
  }

  getNetworkName (networkId) {
    for (let key in networkMap) {
      if (networkMap.hasOwnProperty(key) && networkMap[key].id === networkId) {
        return networkMap[key].name
      }
    }
  }

  componentWillMount () {
    // TODO @dkchv: metamask crashed after network change and do not respond, reserch for this
    const timer = setTimeout(() => {
      location.reload()
    }, 2000)
    window.web3.version.getNetwork((error, curentNetworkId) => {
      clearTimeout(timer)
      const networkId = this.props.selectedNetworkId
      if (error) {
        this.props.addError('Something wrong with MetaMask')
      }
      if (+curentNetworkId === networkId) {
        this.setState({networkMatch: true})
      } else {
        const networkName = this.getNetworkName(networkId)
        this.props.addError(`Metamask network mismatch. Switch it to '${networkName}'.`)
      }
    })
  }

  render () {
    const { networkMatch } = this.state
    return networkMatch ? <AccountSelector onSelectAccount={() => this.props.onLogin()} /> : null
  }
}

export default LoginMetamask
