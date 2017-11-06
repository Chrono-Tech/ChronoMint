import { MenuItem, SelectField } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import styles from '../../components/stylesLoginPage'
import networkService, { clearErrors } from '../../redux/network/actions'

const mapStateToProps = (state) => {
  const network = state.get('network')
  return {
    selectedNetworkId: network.selectedNetworkId,
    networks: network.networks,
    isLoading: network.isLoading,
  }
}

const mapDispatchToProps = (dispatch) => ({
  selectNetwork: (network) => networkService.selectNetwork(network),
  clearErrors: () => dispatch(clearErrors()),
})

@connect(mapStateToProps, mapDispatchToProps)
export default class NetworkSelector extends PureComponent {
  static propTypes = {
    clearErrors: PropTypes.func,
    selectNetwork: PropTypes.func,
    selectedNetworkId: PropTypes.number,
    networks: PropTypes.array,
    onSelect: PropTypes.func,
    isLoading: PropTypes.bool,
  }

  handleChange = (event, index, value) => {
    this.props.clearErrors()
    this.props.selectNetwork(value)
    this.props.onSelect()
  }

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
        {networks && networks.map((n) => <MenuItem key={n.id} value={n.id} primaryText={n.name} />)}
      </SelectField>
    )
  }
}

