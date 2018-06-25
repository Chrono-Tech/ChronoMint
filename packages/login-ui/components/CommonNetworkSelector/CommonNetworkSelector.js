/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import web3Provider from '@chronobank/login/network/Web3Provider'
import web3Utils from '@chronobank/login/network/Web3Utils'
import { clearErrors, DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import {
  getNetworksWithProviders,
  getNetworkWithProviderNames,
  getProviderById,
} from '@chronobank/login/network/settings'
import { Popover } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Button } from 'components'
import classnames from 'classnames'

import { Translate } from 'react-redux-i18n'
import Web3 from 'web3'
import './CommonNetworkSelector.scss'

const mapStateToProps = (state) => {
  const network = state.get(DUCK_NETWORK)
  return {
    providersList: getNetworksWithProviders(network.isLocal),
    networkProviderName: getNetworkWithProviderNames(network.selectedProviderId, network.selectedNetworkId, network.isLocal),
    isLocal: network.isLocal,
    selectedNetworkId: network.selectedNetworkId,
    selectedProvider: getProviderById(network.selectedProviderId),
    networks: network.networks,
    isLoading: network.isLoading,
  }
}

const mapDispatchToProps = (dispatch) => ({
  selectProviderWithNetwork: (networkId, providerId) => {
    networkService.selectProvider(providerId)
    networkService.selectNetwork(networkId)
  },
  selectNetwork: (network) => networkService.selectNetwork(network),
  clearErrors: () => dispatch(clearErrors()),
  getProviderURL: () => networkService.getProviderURL(),
})

@connect(mapStateToProps, mapDispatchToProps)
export default class CommonNetworkSelector extends PureComponent {
  static propTypes = {
    clearErrors: PropTypes.func,
    selectNetwork: PropTypes.func,
    selectProviderWithNetwork: PropTypes.func,
    getProviderURL: PropTypes.func,
    selectedNetworkId: PropTypes.number,
    networks: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      protocol: PropTypes.string,
      name: PropTypes.string,
      scanner: PropTypes.arrayOf(PropTypes.string),
      bitcoin: PropTypes.string,
      nem: PropTypes.string,
    })),
    onSelect: PropTypes.func,
    isLoading: PropTypes.bool,
  }

  constructor (props) {
    super (props)

    this.state = {
      open: false,
    }
  }

  componentDidMount(){
    networkService.autoSelect()
  }

  handleClick = (data) => {
    this.props.clearErrors()
    this.props.selectProviderWithNetwork(data.network.id, data.provider.id)
    this.resolveNetwork()
    this.handleRequestClose()
  }

  resolveNetwork = () => {
    const web3 = new Web3()
    web3Provider.reinit(web3, web3Utils.createStatusEngine(this.props.getProviderURL()))
    web3Provider.resolve()
  }

  handleClickButton = (event) => {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  getFullNetworkName(item){
    return `${item.provider.name} - ${item.network.name}`
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  renderMenuItem(item, i){
    const { selectedNetworkId, selectedProvider } = this.props
    const checked = item.provider.id === selectedProvider.id && item.network.id === selectedNetworkId

    return (
      <li
        styleName={classnames({providerItem: true, providerItemActive: checked })}
        onClick={() => this.handleClick(item)}
        key={i}
      >
        {this.getFullNetworkName(item)}
      </li>
    )
  }

  render () {
    const { selectedNetworkId, selectedProvider, networks, isLoading, networkProviderName, providersList } = this.props

    return (
      <div styleName='root'>
        <Button
          styleName='langButton'
          onClick={this.handleClickButton}
        >
          { selectedProvider && selectedProvider.name }
        </Button>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
          style={{
            background: 'transparent'
          }}
        >
          <ul styleName='providersList'>
            {providersList.map((item, i) => this.renderMenuItem(item, i))}
          </ul>
        </Popover>
      </div>
    )
  }
}

