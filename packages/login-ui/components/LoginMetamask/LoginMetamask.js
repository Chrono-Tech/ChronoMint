import networkService from '@chronobank/login/network/NetworkService'
import { getNetworkById, LOCAL_ID, providerMap } from '@chronobank/login/network/settings'
import web3Provider from '@chronobank/login/network/Web3Provider'
import { addError } from '@chronobank/login/redux/network/actions'
import { TextField } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import AccountSelector from '../../components/AccountSelector/AccountSelector'
import BackButton from '../../components/BackButton/BackButton'
import styles from '../../components/stylesLoginPage'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  providers: state.get('network').providers,
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
    web3Provider.reinit(window.web3, window.web3.currentProvider)
    window.web3.version.getNetwork((error, currentNetworkId) => {
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
          floatingLabelText={<Translate value='LoginMetamask.network' />}
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
