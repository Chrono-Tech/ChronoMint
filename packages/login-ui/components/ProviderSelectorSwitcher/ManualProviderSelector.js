/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { Toggle } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import NetworkSelector from '../../components/NetworkSelector/NetworkSelector'
import NetworkStatus from '../../components/NetworkStatus/NetworkStatus'
import ProviderSelector from '../../components/ProviderSelector/ProviderSelector'
import styles from '../../components/stylesLoginPage'

const mapStateToProps = (state) => {
  const network = state.get(DUCK_NETWORK)
  return {
    selectedProviderId: network.selectedProviderId,
    selectedNetworkId: network.selectedNetworkId,
  }
}

@connect(mapStateToProps)
class ManualProviderSelector extends PureComponent {
  static propTypes = {
    selectedProviderId: PropTypes.number,
    selectedNetworkId: PropTypes.number,
    show: PropTypes.bool,
    currentStrategy: PropTypes.string,
    onSelectorSwitch: PropTypes.func,
  }

  handleToggle = () => this.props.onSelectorSwitch(this.props.currentStrategy)

  render () {
    const { show, selectedProviderId } = this.props

    return (
      <div>
        <Toggle
          label={<Translate value='ProviderSelectorSwitcher.automatic' />}
          onToggle={this.handleToggle}
          toggled={false}
          {...styles.toggle}
        />
        {show && <ProviderSelector />}
        {show && selectedProviderId && <NetworkSelector />}
        {<NetworkStatus />}
      </div>
    )
  }
}

export default ManualProviderSelector
