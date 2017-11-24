import { Toggle } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import NetworkStatus from '../../components/NetworkStatus/NetworkStatus'
import styles from '../../components/stylesLoginPage'
import networkService, { DUCK_NETWORK } from '../../redux/network/actions'

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
