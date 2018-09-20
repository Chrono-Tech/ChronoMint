/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import web3Provider from '@chronobank/login/network/Web3Provider'
import web3Utils from '@chronobank/login/network/Web3Utils'
import { clearErrors } from '@chronobank/login/redux/network/actions'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
import { getNetworkWithProviderNames, getNetworksSelectorGroup } from '@chronobank/login/network/settings'
import { AccountCustomNetwork } from '@chronobank/core/models/wallet/persistAccount'
import { autoSelect, selectProviderWithNetwork } from '@chronobank/login/redux/network/thunks'
import { Popover } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Button from 'components/common/ui/Button/Button'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import classnames from 'classnames'
import Web3 from 'web3'
import { initCommonNetworkSelector } from '../../redux/thunks'

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
    <span styleName='providerItemText'>{children}</span>
    <span onClick={onClickEdit} styleName='providerItemIcon' className='chronobank-icon'>
      edit
    </span>
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
  const persistAccount = state.get(DUCK_PERSIST_ACCOUNT)

  return {
    providersList: getNetworksSelectorGroup(),
    selectedNetworkId: network.selectedNetworkId,
    selectedProviderId: network.selectedProviderId,
    customNetworksList: persistAccount.customNetworksList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  selectProviderWithNetwork: (networkId, providerId) => dispatch(selectProviderWithNetwork(networkId, providerId)),
  clearErrors: () => dispatch(clearErrors()),
  initCommonNetworkSelector: () => dispatch(initCommonNetworkSelector()),
  modalOpenAddNetwork: (network = null) =>
    dispatch(
      modalsOpen({
        componentName: 'NetworkCreateModal',
        props: { network },
      })
    ),
  autoSelect: () => dispatch(autoSelect()),
})

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class CommonNetworkSelector extends PureComponent {
  static propTypes = {
    autoSelect: PropTypes.func,
    clearErrors: PropTypes.func,
    initCommonNetworkSelector: PropTypes.func,
    selectProviderWithNetwork: PropTypes.func,
    selectedNetworkId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    selectedProviderId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    customNetworksList: PropTypes.array,
    modalOpenAddNetwork: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  async componentDidMount () {
    await this.props.initCommonNetworkSelector()
  }

  handleClickDefaultNetwork (data) {
    this.props.clearErrors()
    this.props.selectProviderWithNetwork(data.network.id, data.provider.id)
    this.handleRequestClose()
  }

  handleClickCustomNetwork (data) {
    this.props.clearErrors()
    this.props.selectProviderWithNetwork(data.id, data.id)
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
    return `${item.provider.name} - ${item.network.name}`
  }

  getSelectedNetwork () {
    const { selectedNetworkId, selectedProviderId, customNetworksList } = this.props
    const foundCustomSelectedNetwork = customNetworksList.find((network) => network.id === selectedNetworkId)

    if (foundCustomSelectedNetwork) {
      return foundCustomSelectedNetwork.name
    }

    const baseNetworkNames = getNetworkWithProviderNames(selectedProviderId, selectedNetworkId)

    if (!baseNetworkNames) {
      this.props.autoSelect()
      return ''
    }

    return baseNetworkNames
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

  resolveNetwork (providerUrl) {
    const web3 = new Web3()
    web3Provider.reinit(web3, web3Utils.createStatusEngine(providerUrl))
    web3Provider.resolve()
  }

  renderDefaultNetworksGroups () {
    const { providersList } = this.props

    return (
      <div>
        {providersList.map((group, i) => (
          <div key={i}>
            <HeaderGroup group={group} />
            {
              group.providers
                ? group.providers.map((item, i) =>
                  this.renderMenuItem(item, i)
                )
                : null
            }
          </div>
        ))}
      </div>
    )
  }

  renderMenuItem (item, i) {
    const { selectedNetworkId, selectedProviderId } = this.props

    const checked = item.network.id === selectedNetworkId && item.provider.id === selectedProviderId

    return (
      <MenuDefaultItem onClick={() => this.handleClickDefaultNetwork(item)} checked={checked} key={i}>
        {this.getFullNetworkName(item)}
      </MenuDefaultItem>
    )
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

  render () {
    return (
      <div styleName='root'>
        <Button styleName='networkButton' onClick={this.handleClickButton}>
          {this.getSelectedNetwork()}
        </Button>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          onClose={this.handleRequestClose}
          classes={{
            paper: styles.popover,
          }}
        >
          <div styleName='providersList'>
            {
              this.renderDefaultNetworksGroups()
            }
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
          </div>
        </Popover>
      </div>
    )
  }
}
