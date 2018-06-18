/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import trezorProvider from '@chronobank/login/network/TrezorProvider'
import { fetchAccount, startTrezorSync, stopTrezorSync } from '@chronobank/login/redux/trezor/actions'
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
import './LoginWithTrezor.scss'
import { Button } from '../../settings'

const trezorStates = [ {
  flag: 'isHttps',
  successTitle: 'LoginWithTrezor.isHttps.successTitle',
  errorTitle: 'LoginWithTrezor.isHttps.errorTitle',
  errorTip: 'LoginWithTrezor.isHttps.errorTip',
}, {
  flag: 'isU2F',
  successTitle: 'LoginWithTrezor.isU2F.successTitle',
  errorTitle: 'LoginWithTrezor.isU2F.errorTitle',
  errorTip: 'LoginWithTrezor.isU2F.errorTip',
}, {
  flag: 'isFetched',
  successTitle: 'LoginWithTrezor.isFetched.successTitle',
  errorTitle: 'LoginWithTrezor.isFetched.errorTitle',
  errorTip: 'LoginWithTrezor.isFetched.errorTip',
} ]

const mapStateToProps = (state) => {
  const network = state.get('network')
  return {
    trezor: state.get('trezor'),
    isLoading: network.isLoading,
    account: network.accounts
  }
}

const mapDispatchToProps = (dispatch) => ({
  startTrezorSync: () => dispatch(startTrezorSync()),
  stopTrezorSync: (isReset) => dispatch(stopTrezorSync(isReset)),
  fetchAccount: () => dispatch(fetchAccount()),
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginTrezor extends PureComponent {
  static propTypes = {
    startTrezorSync: PropTypes.func,
    stopTrezorSync: PropTypes.func,
    fetchAccount: PropTypes.func,
    onBack: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    trezor: PropTypes.object,
    isLoading: PropTypes.bool,
    account: PropTypes.array,
  }

  state = {
    value: 0
  }

  componentWillMount () {
    this.props.startTrezorSync()
  }

  componentWillReceiveProps ({ trezor }) {
    if (!trezor.isFetched && !trezor.isFetching && trezor.isHttps && trezor.isU2F) {
      this.props.fetchAccount()
    }
  }

  componentWillUnmount () {
    this.props.stopTrezorSync()
  }

  handleBackClick = () => {
    this.props.stopTrezorSync(true)
    this.props.onBack()
  }

  renderStates () {
    const { trezor } = this.props

    return trezorStates.map((item) => trezor[ item.flag ]
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
    return <MenuItem value={index} key={index} primaryText={item}/>
  }

  handleChange = (event, index, value) => {this.setState({value}); trezorProvider.setWallet(this.props.account[index]); networkService.selectAccount(this.props.account[index]); networkService.setAccounts(this.props.account)}

  render () {
    const { isLoading, trezor, account } = this.props

    return (
      <div styleName='root'>
        <BackButton
          onClick={this.handleBackClick}
          to='options'
        />

        <div styleName='states'>
          {this.renderStates()}
        </div>

        {trezor.isFetched && (
          <div styleName='account'>
            <SelectField floatingLabelText="Select address"
                         autoWidth={true}
                         fullWidth={true}
                         floatingLabelStyle={{ color: 'white' }}
                         labelStyle={{ color: 'white' }}
                         value={this.state.value}
                         onChange={this.handleChange}>
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
                : <Translate value='LoginWithTrezor.login' />
              }
              disabled={isLoading || !account}
              onClick={() => this.props.onLogin()}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LoginTrezor
