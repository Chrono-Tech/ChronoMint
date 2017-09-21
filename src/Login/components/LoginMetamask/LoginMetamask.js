import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TextField } from 'material-ui'
import { Translate } from 'react-redux-i18n'
import { providers, actions, constants } from 'Login/settings'
import networkService, { addError } from 'Login/redux/network/actions'
import AccountSelector from 'Login/components/AccountSelector/AccountSelector'
import styles from 'Login/components/stylesLoginPage'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  providers: state.get('network').providers
})

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  selectNetwork: (networkId) => networkService.selectNetwork(networkId),
  loadAccounts: () => networkService.loadAccounts()
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginMetamask extends Component {
  componentWillMount () {
    providers.web3Provider.setWeb3(window.web3)
    providers.web3Provider.setProvider(window.web3.currentProvider)
    window.web3.version.getNetwork((error, currentNetworkId) => {
      if (error) {
        this.props.addError(<Translate value='LoginMetamask.wrongMetaMask'/>)
      }
      this.props.selectNetwork(Math.min(+currentNetworkId, constants.LOCAL_ID))
    })
  }

  render () {
    const {selectedNetworkId} = this.props
    const name = actions.getNetworkById(selectedNetworkId, constants.providerMap.metamask.id).name
      || <Translate value='LoginMetamask.notDefined'/>
    return (
      <div>
        <TextField
          floatingLabelText={<Translate value='LoginMetamask.network'/>}
          value={name}
          fullWidth
          {...styles.textField}
        />
        <AccountSelector onSelectAccount={() => this.props.onLogin()}/>
      </div>
    )
  }
}

LoginMetamask.propTypes = {
  addError: PropTypes.func,
  selectNetwork: PropTypes.func,
  loadAccounts: PropTypes.func,
  selectedNetworkId: PropTypes.number,
  onLogin: PropTypes.func
}

export default LoginMetamask
