/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { connect } from 'react-redux'
import { Popover } from '@material-ui/core'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { AccountCustomNetwork } from '@chronobank/core/models/wallet/persistAccount'
import { selectCurrentNetwork, selectDisplayNetworksList } from '@chronobank/nodes/redux/selectors'
import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import { networkSelect } from '@chronobank/nodes/redux/thunks'
import Button from 'components/common/ui/Button/Button'
import React, { PureComponent } from 'react'

import styles from './CommonNetworkSelector.scss'

const mapStateToProps = (state) => {
  const currentNetwork = selectCurrentNetwork(state)
  const displayNetworksList = selectDisplayNetworksList(state)
  const customNetworksList = state.get(DUCK_PERSIST_ACCOUNT).customNetworksList

  return {
    currentNetwork,
    displayNetworksList,
    customNetworksList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  networkSelect: (networkIndex) => dispatch(networkSelect(networkIndex)),
  modalOpenAddNetwork: (network = null) =>
    dispatch(
      modalsOpen({
        componentName: 'NetworkCreateModal',
        props: { network },
      })
    ),
})

const SectionHeader = (props) => {
  const { section: { sectionTitle, sectionDescription } } = props

  return (
    <div
      styleName='providerGroupItem'
      key={sectionTitle}
    >
      <div styleName='providerGroupItemTitle'>
        {
          sectionTitle
        }
      </div>
      {
        sectionDescription && (
          <div styleName='providerGroupItemDescription'>
            {
              sectionDescription
            }
          </div>
        )
      }
    </div>
  )
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CommonNetworkSelector extends PureComponent {
  // NOTE: You may find incoming data at @chronobank/nodes/networks/reducer
  static propTypes = {
    displayNetworksList:  PropTypes.arrayOf(PropTypes.shape({
      sectionTitle: PropTypes.string,
      sectionDescription: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]),
      networks: PropTypes.arrayOf(PropTypes.object),
    })),
    currentNetwork: PropTypes.shape({
      networkTitle: PropTypes.string,
      networkIndex: PropTypes.number,
      primaryNode: PropTypes.shape({
        disabled: PropTypes.bool,
        host: PropTypes.string,
      }),
      chronobankMiddlewares: PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ])),
    }),
    customNetworksList: PropTypes.arrayOf(PropTypes.object),
    modalOpenAddNetwork: PropTypes.func,
    networkSelect: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      isNetworkSelectorPopoverOpen: false,
    }
  }

  handleSelectNetwork = (item, isSelected) => (/*e*/) => {
    if (!isSelected) {
      this.props.networkSelect(item.networkIndex)
    }
    this.handleModalNetworkSelectorClose()
  }

  handleShowNetworkSelector = (event) => {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      isNetworkSelectorPopoverOpen: true,
      anchorEl: event.currentTarget,
    })
  }

  handleModalNetworkSelectorClose = () => {
    this.setState({
      isNetworkSelectorPopoverOpen: false,
    })
  }

  handleOpenModalAddNetwork = (network) => (e) => {
    e.stopPropagation()
    this.handleModalNetworkSelectorClose()
    if (network) {
      const networkModel = new AccountCustomNetwork(network)
      this.props.modalOpenAddNetwork(networkModel)
    } else {
      this.props.modalOpenAddNetwork()
    }
  }

  renderPredefinedNetworkSections = () => {
    const { displayNetworksList } = this.props

    return displayNetworksList.map((section) => (
      <div key={section.sectionTitle}>
        <SectionHeader section={section} />
        {
          section.networks.map((network) => {
            const isSelected = network.networkIndex === this.props.currentNetwork.networkIndex
            return (
              <div
                styleName={classnames({
                  providerItem: true,
                  providerItemActive: isSelected,
                })}
                key={network.networkTitle}
                onClick={this.handleSelectNetwork(network, isSelected)}
              >
                {
                  network.networkTitle
                }
              </div>
            )
          })
        }
      </div>
    ))
  }

  // TODO: to internationalize text inside
  // TODO: to complete this method. At the moment it using Redux persistAccount.customNetworkList
  renderCustomNetworkSection = () => (
    <div>
      <SectionHeader section={{ sectionTitle: 'Custom networks' }} />
      <div>
        {
          this.props.customNetworksList.map((network) => (
            <div
              styleName={classnames({
                providerItem: true,
                providerItemActive: network.networkIndex === this.props.currentNetwork.networkIndex,
              })}
              onClick={this.handleOpenModalAddNetwork(network)}
              key={network.name}
            >
              <span styleName='providerItemText'>
                {
                  network.networkTitle || ''
                }
              </span>
              <span
                onClick={this.handleOpenModalAddNetwork(network)}
                styleName='providerItemIcon'
                className='chronobank-icon'
              >
                edit
              </span>
            </div>
          ))
        }
      </div>
      <div
        styleName='providerItem'
        onClick={this.handleOpenModalAddNetwork()}
      >
        Add a Network ...
      </div>
    </div>
  )

  render () {
    const { customNetworksList } = this.props

    return (
      <div styleName='root'>
        <Button
          styleName='networkButton'
          onClick={this.handleShowNetworkSelector}
        >
          {
            this.props.currentNetwork.networkTitle
          }
        </Button>

        <Popover
          open={this.state.isNetworkSelectorPopoverOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          onClose={this.handleModalNetworkSelectorClose}
          classes={{
            paper: styles.popover,
          }}
        >
          <div styleName='providersList'>
            <div>
              {
                this.renderPredefinedNetworkSections()
              }
            </div>
            {
              customNetworksList && this.renderCustomNetworkSection()
            }
          </div>
        </Popover>
      </div>
    )
  }
}
