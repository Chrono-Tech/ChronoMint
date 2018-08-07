/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { getNetworkById, LOCAL_ID, providerMap } from '@chronobank/login/network/settings'
import web3Provider from '@chronobank/login/network/Web3Provider'
import Web3 from 'web3'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import EthereumEngine from '@chronobank/login/network/EthereumEngine'
import { addError } from '@chronobank/login/redux/network/actions'
import { TextField } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import AccountSelector from '../../components/AccountSelector/AccountSelector'
import BackButton from '../../components/BackButton/BackButton'
import styles from '../../components/stylesLoginPage'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get(DUCK_NETWORK).selectedNetworkId,
  providers: state.get(DUCK_NETWORK).providers,
})

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  selectNetwork: (networkId) => networkService.selectNetwork(networkId),
  loadAccounts: () => networkService.loadAccounts(),
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginMetamask extends PureComponent {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    addError: PropTypes.func,
    selectNetwork: PropTypes.func,
    loadAccounts: PropTypes.func,
    selectedNetworkId: PropTypes.number,
    onLogin: PropTypes.func,
  }

  componentWillMount () {
    const web3 = new Web3(window.Web3.currentProvider)
    web3Provider.reinit(web3, window.Web3.currentProvider)
    const engine = new EthereumEngine(null,{ id: web3.version.network },null,window.Web3.currentProvider,null)
    ethereumProvider.setEngine(engine, null)
    window.Web3.version.getNetwork((error, currentNetworkId) => {
      if (error) {
        this.props.addError(<Translate value='LoginMetamask.wrongMetaMask' />)
      }
      this.props.selectNetwork(Math.min(+currentNetworkId, LOCAL_ID))
    })
  }

  render () {
    const { selectedNetworkId } = this.props
    const name = getNetworkById(selectedNetworkId, providerMap.metamask.id).name
      || <Translate value='LoginMetamask.notDefined' />
    return (
      <div>
        <BackButton
          onClick={this.props.onBack}
          to='options'
        />
        <TextField
          label={<Translate value='LoginMetamask.network' />}
          value={name}
          fullWidth
          {...styles.textField}
        />
        <AccountSelector onSelectAccount={this.props.onLogin} />
      </div>
    )
  }
}

export default LoginMetamask
