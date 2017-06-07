import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getScannerById } from '../../network/settings'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  selectedProviderId: state.get('network').selectedProviderId
})

@connect(mapStateToProps, null)
export default class EtherscankLink extends Component {
  getBaseScannerUrl () {
    const {selectedNetworkId, selectedProviderId} = this.props
    return getScannerById(selectedNetworkId, selectedProviderId)
  }

  text () {
    return this.props.txHash || this.props.address
  }

  getEtherscanUrl () {
    const baseScannerUrl = this.getBaseScannerUrl()
    if (!baseScannerUrl) {
      return null
    }

    return this.props.txHash ? `${baseScannerUrl}/tx/${this.props.txHash}` : `${baseScannerUrl}/address/${this.props.address}`
  }

  render () {
    const etherscanHref = this.getEtherscanUrl()

    return etherscanHref ? <a href={etherscanHref} target='_blank'>{this.text()}</a> : <span>{this.text()}</span>
  }
}
