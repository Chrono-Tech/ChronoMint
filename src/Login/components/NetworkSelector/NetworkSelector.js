import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MenuItem, SelectField } from 'material-ui'
import { clearErrors, selectNetwork } from 'redux/network/actions'
import { Translate } from 'react-redux-i18n'
import styles from 'Login/components/stylesLoginPage'

const mapStateToProps = (state) => {
  const network = state.get('network')
  return {
    selectedNetworkId: network.selectedNetworkId,
    networks: network.networks,
    isLoading: network.isLoading
  }
}

const mapDispatchToProps = (dispatch) => ({
  selectNetwork: (network) => dispatch(selectNetwork(network)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
export default class NetworkSelector extends Component {

  static propTypes = {
    clearErrors: PropTypes.func,
    selectNetwork: PropTypes.func,
    selectedNetworkId: PropTypes.number,
    networks: PropTypes.array,
    onSelect: PropTypes.func,
    isLoading: PropTypes.bool
  }

  handleChange = (event, index, value) => {
    this.props.clearErrors()
    this.props.selectNetwork(value)
    this.props.onSelect()
  }

  render () {
    const {selectedNetworkId, networks, isLoading} = this.props
    return (
      <SelectField
        floatingLabelText={<Translate value='NetworkSelector.network'/>}
        onChange={this.handleChange}
        value={selectedNetworkId}
        fullWidth
        disabled={isLoading}
        {...styles.selectField}>
        {networks && networks.map(n => <MenuItem key={n.id} value={n.id} primaryText={n.name} />)}
      </SelectField>
    )
  }
}
