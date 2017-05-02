import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MenuItem, SelectField } from 'material-ui'
import { clearErrors, selectProvider } from '../../../redux/network/actions'

const mapStateToProps = (state) => ({
  selectedProviderId: state.get('network').selectedProviderId,
  providers: state.get('network').providers
})

const mapDispatchToProps = (dispatch) => ({
  selectProvider: (providerId) => dispatch(selectProvider(providerId)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class ProviderSelector extends Component {
  handleChange = (event, index, value) => {
    this.props.clearErrors()
    this.props.selectProvider(value)
  }

  render () {
    const {selectedProviderId, providers} = this.props

    return (
      <SelectField
        floatingLabelText='Provider'
        onChange={this.handleChange}
        value={selectedProviderId}
        fullWidth>
        {providers && providers.map(p => (
          <MenuItem
            key={p.id}
            value={p.id}
            primaryText={p.name}
            disabled={p.disabled}
          />
        ))}
      </SelectField>
    )
  }
}

export default ProviderSelector
