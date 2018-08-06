/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { Toggle } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import NetworkStatus from '../../components/NetworkStatus/NetworkStatus'
import styles from '../../components/stylesLoginPage'

const mapStateToProps = (state) => {
  const network = state.get(DUCK_NETWORK)
  return {
    selectedProviderId: network.selectedProviderId,
    selectedNetworkId: network.selectedNetworkId,
  }
}

const startAutoSelect = async () => {
  await networkService.autoSelect()
}

@connect(mapStateToProps)
class AutomaticProviderSelector extends PureComponent {
  static propTypes = {
    selectedProviderId: PropTypes.number,
    selectedNetworkId: PropTypes.number,
    show: PropTypes.bool,
    currentStrategy: PropTypes.string,
    onSelectorSwitch: PropTypes.func,
  }

  componentDidMount () {
    return startAutoSelect()
  }

  handleToggle = () => this.props.onSelectorSwitch(this.props.currentStrategy)

  render () {
    return (
      <div>
        <Toggle
          label={<Translate value='ProviderSelectorSwitcher.manual' />}
          onToggle={this.handleToggle}
          toggled
          {...styles.toggle}
        />
        <NetworkStatus />
      </div>
    )
  }
}

export default AutomaticProviderSelector
