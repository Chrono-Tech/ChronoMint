import { MenuItem, SelectField } from 'material-ui'
import Web3 from 'web3'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import styles from '../../components/stylesLoginPage'
import networkService, { clearErrors, DUCK_NETWORK } from '../../redux/network/actions'
import web3Utils from '../../network/Web3Utils'
import web3Provider from '../../network/Web3Provider'

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
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(web3Utils.createStatusEngine(this.props.getProviderURL()))
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

