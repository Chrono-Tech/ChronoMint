/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ledgerProvider from '@chronobank/login/network/LedgerProvider'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { fetchAccount, startLedgerSync, stopLedgerSync } from '@chronobank/login/redux/ledger/actions'
import { CircularProgress, RaisedButton } from 'material-ui'
import networkService from '@chronobank/login/network/NetworkService'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Subheader from 'material-ui/Subheader'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import BackButton from '../../components/BackButton/BackButton'
import './LoginWithLedger.scss'
import { Button } from '../../settings'

const ledgerStates = [ {
  flag: 'isHttps',
  successTitle: 'LoginWithLedger.isHttps.successTitle',
  errorTitle: 'LoginWithLedger.isHttps.errorTitle',
  errorTip: 'LoginWithLedger.isHttps.errorTip',
}, {
  flag: 'isU2F',
  successTitle: 'LoginWithLedger.isU2F.successTitle',
  errorTitle: 'LoginWithLedger.isU2F.errorTitle',
  errorTip: 'LoginWithLedger.isU2F.errorTip',
}, {
  flag: 'isETHAppOpened',
  successTitle: 'LoginWithLedger.isETHAppOpened.successTitle',
  errorTitle: 'LoginWithLedger.isETHAppOpened.errorTitle',
  errorTip: 'LoginWithLedger.isETHAppOpened.errorTip',
}, {
  flag: 'isFetched',
  successTitle: 'LoginWithLedger.isFetched.successTitle',
  errorTitle: 'LoginWithLedger.isFetched.errorTitle',
  errorTip: 'LoginWithLedger.isFetched.errorTip',
} ]

const mapStateToProps = (state) => {
  const network = state.get(DUCK_NETWORK)
  return {
    ledger: state.get('ledger'),
    isLoading: network.isLoading,
    account: network.accounts
  }
}

const mapDispatchToProps = (dispatch) => ({
  startLedgerSync: () => dispatch(startLedgerSync()),
  stopLedgerSync: (isReset) => dispatch(stopLedgerSync(isReset)),
  fetchAccount: () => dispatch(fetchAccount()),
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginLedger extends PureComponent {
  static propTypes = {
    startLedgerSync: PropTypes.func,
    stopLedgerSync: PropTypes.func,
    fetchAccount: PropTypes.func,
    onBack: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    ledger: PropTypes.shape({
      isFetched: PropTypes.bool,
      isFetching: PropTypes.bool,
      isHttps: PropTypes.bool,
      isETHAppOpened: PropTypes.bool,
    }),
    isLoading: PropTypes.bool,
    account: PropTypes.array,
  }

  state = {
    value: 0,
  };

  componentWillMount () {
    this.props.startLedgerSync()
  }

  componentDidUpdate (prevProps) {
    if (!this.props.ledger.isFetched && !this.props.ledger.isFetching && this.props.ledger.isHttps && this.props.ledger.isU2F && this.props.ledger.isETHAppOpened) {
      this.props.fetchAccount()
    }
    ledgerProvider.setWallet(prevProps.account[0]); networkService.selectAccount(prevProps.account[0]); networkService.setAccounts(prevProps.account)
  }

  componentWillUnmount () {
    this.props.stopLedgerSync()
  }

  handleBackClick = () => {
    this.props.stopLedgerSync(true)
    this.props.onBack()
  }

  renderStates () {
    const { ledger } = this.props

    return ledgerStates.map((item) => ledger[ item.flag ]
      ? (
        <div styleName='state' key={item.flag}>
          <div styleName='flag flagDone' className='material-icons'>done</div>
          <div styleName='titleContent'><Translate value={item.successTitle} /></div>
        </div>
      )
      : (
        <div styleName='state' key={item.flag}>
          <div styleName='flag flagError' className='material-icons'>error</div>
          <div styleName='titleContent'>
            <div styleName='title'><Translate value={item.errorTitle} /></div>
            <div styleName='subtitle'><Translate value={item.errorTip} /></div>
          </div>
        </div>
      ))
  }

  _buildItem(item, index) {
    return <MenuItem value={index} key={index} primaryText={item} />
  }

  handleChange = (event, index, value) => {this.setState({ value }); ledgerProvider.setWallet(this.props.account[index]); networkService.selectAccount(this.props.account[index]);}

  render () {
    const { isLoading, ledger, account } = this.props

    return (
      <div styleName='root'>
        <BackButton
          onClick={this.handleBackClick}
          to='options'
        />

        <div styleName='states'>
          {this.renderStates()}
        </div>

        {ledger.isFetched && (
          <div styleName='account'>
            <SelectField
              label='Select address'
              autoWidth={true}
              fullWidth={true}
              floatingLabelStyle={{ color: 'white' }}
              labelStyle={{ color: 'white' }}
              value={this.state.value}
              onChange={this.handleChange}
            >
              {this.props.account.map(this._buildItem)}
            </SelectField>
          </div>
        )}

        <div styleName='actions'>
          <div styleName='action'>
            <Button
              label={isLoading
                ? (
                  <CircularProgress
                    style={{ verticalAlign: 'middle', marginTop: -2 }}
                    size={24}
                    thickness={1.5}
                  />
                )
                : <Translate value='LoginWithLedger.login' />
              }
              primary
              fullWidth
              disabled={isLoading || !account}
              onClick={this.props.onLogin}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LoginLedger
