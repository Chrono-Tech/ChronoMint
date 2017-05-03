import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MenuItem, SelectField } from 'material-ui'
import { clearErrors, selectNetwork } from '../../../redux/network/actions'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  networks: state.get('network').networks
})

const mapDispatchToProps = (dispatch) => ({
  selectNetwork: (network) => dispatch(selectNetwork(network)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class NetworkSelector extends Component {
  handleChange = (event, index, value) => {
    this.props.clearErrors()
    this.props.selectNetwork(value)
    this.props.onSelect()
  }

  render () {
    const {selectedNetworkId, networks} = this.props
    return (
      <SelectField
        floatingLabelText='Network'
        onChange={this.handleChange}
        value={selectedNetworkId}
        fullWidth>
        {networks && networks.map(n => <MenuItem key={n.id} value={n.id} primaryText={n.name} />)}
      </SelectField>
    )
  }
}

export default NetworkSelector
