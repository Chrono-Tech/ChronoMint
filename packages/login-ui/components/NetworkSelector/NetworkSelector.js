/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import web3Provider from '@chronobank/login/network/Web3Provider'
import web3Utils from '@chronobank/login/network/Web3Utils'
import { clearErrors, DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import { MenuItem, SelectField } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Web3Legacy from 'web3legacy'
import Web3 from 'web3_1'
import styles from '../../components/stylesLoginPage'

console.log('window.Web3LegacyWeb3Legacy: ', Web3Legacy, Web3)

const mapStateToProps = (state) => {
  const network = state.get(DUCK_NETWORK)
  return {
    selectedNetworkId: network.selectedNetworkId,
    networks: network.networks,
    isLoading: network.isLoading,
  }
}

const mapDispatchToProps = (dispatch) => ({
  selectNetwork: (network) => networkService.selectNetwork(network),
  clearErrors: () => dispatch(clearErrors()),
  getProviderURL: () => networkService.getProviderURL(),
})

@connect(mapStateToProps, mapDispatchToProps)
export default class NetworkSelector extends PureComponent {
  static propTypes = {
    clearErrors: PropTypes.func,
    selectNetwork: PropTypes.func,
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

  handleChange = (event, index, value) => {
    this.props.clearErrors()
    this.props.selectNetwork(value)
    this.resolveNetwork()
  }

  resolveNetwork = () => {
    const web3 = new Web3Legacy()
    web3Provider.reinit(web3, web3Utils.createStatusEngine(this.props.getProviderURL()))
    web3Provider.resolve()
  }

  renderNetworkItem = (n) => <MenuItem key={n.id} value={n.id} primaryText={n.name} />

  render () {
    const { selectedNetworkId, networks, isLoading } = this.props
    return (
      <SelectField
        floatingLabelText={<Translate value='NetworkSelector.network' />}
        onChange={this.handleChange}
        value={selectedNetworkId}
        fullWidth
        disabled={isLoading}
        {...styles.selectField}
      >
        {networks && networks.map(this.renderNetworkItem)}
      </SelectField>
    )
  }
}

