/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { autoSelect } from '@chronobank/login/redux/network/thunks'
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

const mapDispatchToProps = (dispatch) => ({
  autoSelect: () => dispatch(autoSelect())
})

@connect(mapStateToProps, mapDispatchToProps)
class AutomaticProviderSelector extends PureComponent {
  static propTypes = {
    autoSelect: PropTypes.func,
    currentStrategy: PropTypes.string,
    onSelectorSwitch: PropTypes.func,
  }

  componentDidMount () {
    this.props.autoSelect()
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
