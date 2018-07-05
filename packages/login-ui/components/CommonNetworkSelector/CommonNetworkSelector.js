/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import web3Provider from '@chronobank/login/network/Web3Provider'
import web3Utils from '@chronobank/login/network/Web3Utils'
import {
  clearErrors,
  DUCK_NETWORK,
  selectProviderWithNetwork,
  initCommonNetworkSelector,
} from '@chronobank/login/redux/network/actions'
import {
  getNetworksWithProviders,
  isTestRPC,
  getProviderById,
  providerMap,
  networkSelectorGroups,
} from '@chronobank/login/network/settings'
import { Popover } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Button from 'components/common/ui/Button/Button'
import NetworkCreateModal from 'components/dialogs/NetworkCreateModal/NetworkCreateModal'
import { modalsOpen } from 'redux/modals/actions'
import classnames from 'classnames'
import Web3 from 'web3'

import './CommonNetworkSelector.scss'

const mapStateToProps = (state) => {
  const network = state.get(DUCK_NETWORK)
  const persistAccount = state.get('persistAccount')

  return {
    providersList: getNetworksWithProviders(network.providers, network.isLocal),
    isLocal: network.isLocal,
    selectedNetworkId: network.selectedNetworkId,
    selectedProvider: getProviderById(network.selectedProviderId),
    networks: network.networks,
    isLoading: network.isLoading,
    customNetworksList: persistAccount.customNetworksList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  selectProviderWithNetwork: (networkId, providerId) => dispatch(selectProviderWithNetwork(networkId, providerId)),
  selectNetwork: (network) => networkService.selectNetwork(network),
  clearErrors: () => dispatch(clearErrors()),
  getProviderURL: () => networkService.getProviderURL(),
  initCommonNetworkSelector: () => dispatch(initCommonNetworkSelector()),
  modalOpenAddNetwork: () => dispatch(modalsOpen({
    component: NetworkCreateModal,
    props: {},
  })),
})

@connect(mapStateToProps, mapDispatchToProps)
export default class CommonNetworkSelector extends PureComponent {
  static propTypes = {
    clearErrors: PropTypes.func,
    selectNetwork: PropTypes.func,
    initCommonNetworkSelector: PropTypes.func,
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
    customNetworksList: PropTypes.array,
    modalOpenAddNetwork: PropTypes.func,
  }

  constructor (props) {
    super (props)

    this.state = {
      open: false,
    }
  }

  componentDidMount(){
    this.props.initCommonNetworkSelector()
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
    if (isTestRPC(item.provider.id, item.network.id)){
      return 'TestRPC'
    }

    return `${item.provider.name} - ${item.network.name}`
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  renderCustomNetworksList(){
    const list = [{
      title: 'Custom network',

    }]
    return (
      <div>

      </div>
    )
  }

  renderCustomNetworksGroup(){
    return (
      <div>
        { this.renderGroupHeader({ title: 'Custom networks' }) }
        { this.renderCustomNetworksList() }
        <div
          styleName='providerItem'
          onClick={this.props.modalOpenAddNetwork}
        >
          Add a Network ...
        </div>
      </div>
    )
  }

  renderNetworkGroups(){
    return this.renderDefaultNetworksGroups()
  }

  renderGroupHeader(group){
    return (
      <div
        styleName='providerGroupItem'
      >
        <div styleName='providerGroupItemTitle'>{group.title}</div>
        <div styleName='providerGroupItemDescription'>{group.description ? group.description : null}</div>
      </div>
    )
  }

  renderDefaultNetworksGroups(){
    return (
      <div>
        {
          networkSelectorGroups.map((group, i) => (
            <div key={i}>
              <div>{this.renderGroupHeader(group)}</div>
              <div>
                { group.providers ? group.providers.map((item, i) => this.renderMenuItem(item, i)) : null }
              </div>
            </div>
          ))
        }
      </div>
    )
  }

  renderMenuItem(item, i){
    console.log('render', item, i)
    const { selectedNetworkId, selectedProvider } = this.props
    const checked = item.provider.id === selectedProvider.id && item.network.id === selectedNetworkId

    return (
      <div
        styleName={classnames({providerItem: true, providerItemActive: checked })}
        onClick={() => this.handleClick(item)}
        key={i}
      >
        {this.getFullNetworkName(item)}
      </div>
    )
  }

  render () {
    const { selectedNetworkId, selectedProvider, networks, isLoading, providersList } = this.props

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
            background: 'transparent',
            borderRadius: 20,
          }}
        >
          <div styleName='providersList'>
            { this.renderDefaultNetworksGroups() }
          </div>
        </Popover>
      </div>
    )
  }
}

