/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import { clearErrors } from '@chronobank/login/redux/network/actions'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { MenuItem, SelectField } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import styles from '../../components/stylesLoginPage'

const mapStateToProps = (state) => {
  const network = state.get(DUCK_NETWORK)
  return {
    selectedProviderId: network.selectedProviderId,
    providers: network.providers,
    isLoading: network.isLoading,
  }
}

const mapDispatchToProps = (dispatch) => ({
  selectProvider: (providerId) => networkService.selectProvider(providerId),
  clearErrors: () => dispatch(clearErrors()),
})

@connect(mapStateToProps, mapDispatchToProps)
class ProviderSelector extends PureComponent {
  static propTypes = {
    clearErrors: PropTypes.func,
    selectProvider: PropTypes.func,
    selectedProviderId: PropTypes.number,
    providers: PropTypes.array,
    isLoading: PropTypes.bool,
  }

  handleChange = (event, index, value) => {
    this.props.clearErrors()
    this.props.selectProvider(value)
  }

  render () {
    const { selectedProviderId, providers, isLoading } = this.props

    return (
      <SelectField
        label={<Translate value='ProviderSelector.provider' />}
        onChange={this.handleChange}
        value={selectedProviderId}
        fullWidth
        disabled={isLoading}
        {...styles.selectField}
      >
        {providers && providers.map((p) => (
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

