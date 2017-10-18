import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TextField } from 'material-ui'
import { addError, loadAccounts, selectNetwork } from 'redux/network/actions'
import AccountSelector from '../AccountSelector/AccountSelector'
import { getNetworkById, LOCAL_ID, providerMap } from 'network/settings'
import web3Provider from 'network/Web3Provider'
import { Translate } from 'react-redux-i18n'
import styles from '../stylesLoginPage'

const mapStateToProps = state => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  providers: state.get('network').providers,
})

const mapDispatchToProps = dispatch => ({
  addError: error => dispatch(addError(error)),
  selectNetwork: networkId => dispatch(selectNetwork(networkId)),
  loadAccounts: () => dispatch(loadAccounts()),
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginMetamask extends Component {
  componentWillMount() {
    web3Provider.setWeb3(window.web3)
    web3Provider.setProvider(window.web3.currentProvider)
    window.web3.version.getNetwork((error, currentNetworkId) => {
      if (error) {
        this.props.addError(<Translate value='LoginMetamask.wrongMetaMask' />)
      }
      this.props.selectNetwork(Math.min(+currentNetworkId, LOCAL_ID))
    })
  }

  render() {
    const { selectedNetworkId } = this.props
    const name = getNetworkById(selectedNetworkId, providerMap.metamask.id).name
      || <Translate value='LoginMetamask.notDefined' />
    return (
      <div>
        <TextField
          floatingLabelText={<Translate value='LoginMetamask.network' />}
          value={name}
          fullWidth
          {...styles.textField}
        />
        <AccountSelector onSelectAccount={() => this.props.onLogin()} />
      </div>
    )
  }
}

LoginMetamask.propTypes = {
  addError: PropTypes.func,
  selectNetwork: PropTypes.func,
  loadAccounts: PropTypes.func,
  selectedNetworkId: PropTypes.number,
  onLogin: PropTypes.func,
}

export default LoginMetamask
