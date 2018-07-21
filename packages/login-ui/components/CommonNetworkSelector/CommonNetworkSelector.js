/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import Web3Legacy from 'web3legacy'
import web3Provider from '@chronobank/login/network/Web3Provider'
import web3Utils from '@chronobank/login/network/Web3Utils'
import { clearErrors, DUCK_NETWORK, initCommonNetworkSelector, selectProviderWithNetwork } from '@chronobank/login/redux/network/actions'
import { getNetworksWithProviders, getNetworkWithProviderNames, getProviderById, isLocalNode, networkSelectorGroups } from '@chronobank/login/network/settings'
import { AccountCustomNetwork } from '@chronobank/core/models/wallet/persistAccount'
import { customNetworksListAdd } from '@chronobank/core/redux/persistAccount/actions'
import { Popover } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Button from 'components/common/ui/Button/Button'
import { modalsOpen } from 'redux/modals/actions'
import classnames from 'classnames'
import Web3 from 'web3'
import NetworkCreateModal from '../NetworkCreateModal/NetworkCreateModal'

import styles from './CommonNetworkSelector.scss'

const HeaderGroup = ({ group, ...props }) => (
  <div styleName='providerGroupItem' {...props}>
    <div styleName='providerGroupItemTitle'>{group.title}</div>
    <div styleName='providerGroupItemDescription'>{group.description ? group.description : null}</div>
  </div>
)

const MenuCustomItem = ({ network, onClickEdit, children, checked, ...props }) => (
  <div
    styleName={classnames({
      providerItem: true,
      providerItemActive: checked,
    })}
    {...props}
  >
    <span styleName='providerItemText'>
      {children}
    </span>
    <span onClick={onClickEdit} styleName='providerItemIcon' className='chronobank-icon'>edit</span>
  </div>
)

const MenuDefaultItem = ({ checked, children, ...props }) => (
  <div
    styleName={classnames({
      providerItem: true,
      providerItemActive: checked,
    })}
    {...props}
  >
    {children}
  </div>
)

const mapStateToProps = (state) => {
  const network = state.get(DUCK_NETWORK)
  const persistAccount = state.get('persistAccount')

  return {
    providersList: getNetworksWithProviders(network.providers, network.isLocal),
    isLocal: network.isLocal,
    selectedNetworkId: network.selectedNetworkId,
    selectedProviderId: network.selectedProviderId,
    selectedProvider: network.selectedProviderId && getProviderById(network.selectedProviderId),
    networks: network.networks,
    isLoading: network.isLoading,
    customNetworksList: persistAccount.customNetworksList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  selectProviderWithNetwork: (networkId, providerId) => dispatch(selectProviderWithNetwork(networkId, providerId)),
  selectNetwork: (network) => networkService.selectNetwork(network),
  selectProvider: (providerId) => networkService.selectProvider(providerId),
  clearErrors: () => dispatch(clearErrors()),
  getProviderURL: () => networkService.getProviderURL(),
  initCommonNetworkSelector: () => dispatch(initCommonNetworkSelector()),
  customNetworksListAdd: (network) => dispatch(customNetworksListAdd(network)),
  modalOpenAddNetwork: (network = null) => dispatch(modalsOpen({
    component: NetworkCreateModal,
    props: { network },
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
    selectedNetworkId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    selectedProviderId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
    customNetworksListAdd: PropTypes.func,
    selectProvider: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  componentDidMount () {
    this.props.initCommonNetworkSelector()
  }

  handleClickDefaultNetwork (data) {
    this.props.clearErrors()
    this.props.selectProviderWithNetwork(data.network.id, data.provider.id)
    this.resolveNetwork(this.props.getProviderURL())
    this.handleRequestClose()
  }

  handleClickCustomNetwork (data) {
    this.props.clearErrors()
    this.props.selectProviderWithNetwork(data.id, data.id)
    this.resolveNetwork(data.url)
    this.handleRequestClose()
  }

  handleClickButton = (event) => {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  getFullNetworkName (item) {
    if (isLocalNode(item.provider.id, item.network.id)) {
      return 'localNode'
    }

    return `${item.provider.name} - ${item.network.name}`
  }

  renderCustomNetworksList () {
    const { customNetworksList, selectedNetworkId } = this.props

    if (!customNetworksList) {
      return
    }

    return (
      <div>
        {customNetworksList.map((network, i) => (
          <MenuCustomItem
            onClickEdit={(e) => {
              e.stopPropagation()
              this.openModalAddNetwork(network)
            }}
            onClick={() => this.handleClickCustomNetwork(network)}
            checked={selectedNetworkId === (network && network.id)}
            key={i}
          >
            {network && network.name}
          </MenuCustomItem>
        ))}
      </div>
    )
  }

  openModalAddNetwork (network) {
    this.handleRequestClose()
    if (network) {
      const networkModel = new AccountCustomNetwork(network)
      this.props.modalOpenAddNetwork(networkModel)
    } else {
      this.props.modalOpenAddNetwork()
    }
  }

  renderCustomNetworksGroup () {
    return (
      <div>
        <HeaderGroup group={{ title: 'Custom networks' }} />
        {this.renderCustomNetworksList()}
        <div
          styleName='providerItem'
          onClick={() => this.openModalAddNetwork()}
        >
          Add a Network ...
        </div>
      </div>
    )
  }

  renderDefaultNetworksGroups () {
    return (
      <div>
        {
          networkSelectorGroups.map((group, i) => (
            <div key={i}>
              <HeaderGroup group={group} />
              {group.providers ? group.providers.map((item, i) => this.renderMenuItem(item, i)) : null}
            </div>
          ))
        }
      </div>
    )
  }


  renderMenuItem (item, i) {
    const { selectedNetworkId, selectedProvider } = this.props
    const checked = item.network.id === selectedNetworkId && item.provider.id === (selectedProvider && selectedProvider.id)

    return (
      <MenuDefaultItem
        onClick={() => this.handleClickDefaultNetwork(item)}
        checked={checked}
        key={i}
      >
        {this.getFullNetworkName(item)}
      </MenuDefaultItem>
    )
  }

  getSelectedNetwork () {
    const { selectedNetworkId, selectedProviderId, selectedProvider, customNetworksList } = this.props

    const foundCustomSelectedNetwork = customNetworksList.find((network) => network.id === selectedNetworkId)

    if (foundCustomSelectedNetwork) {
      return foundCustomSelectedNetwork.name
    }

    const baseNetworkNames = getNetworkWithProviderNames(selectedProviderId, selectedNetworkId)

    if (!baseNetworkNames) {
      networkService.autoSelect()

      return ''
    }

    return baseNetworkNames
  }

  resolveNetwork (providerUrl) {
    const web3 = new Web3()
    web3Provider.reinit(web3, web3Utils.createStatusEngine(providerUrl))
    web3Provider.resolve()
  }

  render () {
    const { selectedProvider, providersList } = this.props

    return (
      <div styleName='root'>
        <Button
          styleName='langButton'
          onClick={this.handleClickButton}
        >
          {this.getSelectedNetwork()}
        </Button>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          onClose={this.handleRequestClose}
          classes={{
            paper: styles.popover,
          }}
        >
          <div styleName='providersList'>
            {this.renderDefaultNetworksGroups()}
            {this.renderCustomNetworksGroup()}
          </div>
        </Popover>
      </div>
    )
  }
}

