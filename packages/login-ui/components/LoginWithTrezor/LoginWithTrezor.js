/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from '@material-ui/core'
import styles from 'layouts/Splash/styles'
import { fetchAccount, startTrezorSync, stopTrezorSync } from '@chronobank/login/redux/trezor/actions'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import ChevronRight from '@material-ui/icons/ChevronRight'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import {
  navigateToCreateAccountFromHW,
} from '@chronobank/login/redux/network/actions'
import {
  navigateBack,
} from '../../redux/actions'

import './LoginWithTrezor.scss'

const trezorStates = [ {
  flag: 'isFetched',
  successTitle: 'LoginWithTrezor.isConnected.successTitle',
  errorTitle: 'LoginWithTrezor.isConnected.errorTitle',
  errorTip: 'LoginWithTrezor.isConnected.errorTip',
} ]

const mapStateToProps = (state) => {
  const network = state.get('network')
  return {
    trezor: state.get('trezor'),
    isLoading: network.isLoading,
    account: network.accounts,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    startTrezorSync: () => dispatch(startTrezorSync()),
    stopTrezorSync: (isReset) => dispatch(stopTrezorSync(isReset)),
    fetchAccount: () => dispatch(fetchAccount()),
    navigateToCreateAccountFromHW: (account) => dispatch(navigateToCreateAccountFromHW(account)),
    navigateBack: () => dispatch(navigateBack()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class LoginTrezor extends PureComponent {
  static propTypes = {
    startTrezorSync: PropTypes.func,
    stopTrezorSync: PropTypes.func,
    fetchAccount: PropTypes.func,
    onBack: PropTypes.func,
    onLogin: PropTypes.func,
    navigateBack: PropTypes.func,
    trezor: PropTypes.object,
    isLoading: PropTypes.bool,
    account: PropTypes.instanceOf(Array),
    navigateToCreateAccountFromHW: PropTypes.func,
  }

  static getDerivedStateFromProps (props, state) {
    if (!props.trezor.isFetched && !props.trezor.isFetching) {
      props.startTrezorSync()
      props.fetchAccount()
    }
  }

  componentWillUnmount () {
    this.props.stopTrezorSync()
  }

  renderStates () {
    const { trezor } = this.props

    return trezorStates.map((item) =>
      trezor[ item.flag ]
        ? <div key={item.flag} />
        : (
          <div styleName='state' key={item.flag}>
            <div styleName='titleContent'>
              <div styleName='title'><Translate value={item.errorTitle} /></div>
              <div styleName='subtitle'><Translate value={item.errorTip} /></div>
            </div>
          </div>
        )
    )
  }

  handleChange = (index, value) => {
    console.log(index, value)
    this.setState({ value })
  }

  _buildItem = (item, index) => {
    return (
      <div key={index}>
        <ListItem
          button
          type='submit'
          name='address'
          value={item}
          component='button'
          disableGutters={true}
          style={{ margin: 0 }}
          onClick={() => this.props.navigateToCreateAccountFromHW(item)}
        >
          <ListItemText
            style={{ paddingLeft:"10px" }}
            disableTypography
            primary={
              <Typography
                type='body2'
                style={{ color: 'black', fontWeight: 'bold' }}
              >
                {item}
              </Typography>
            }
            secondary='eth 0'
          />
          <ChevronRight />
        </ListItem>
        <Divider light />
      </div>
    )
  }

  render () {
    const { trezor, navigateBack, account } = this.props

    return (
      <div styleName='form'>
        <div styleName='page-title'>
          <Translate value='LoginWithTrezor.title' />
        </div>

        <div styleName='states'>
          {this.renderStates()}
        </div>

        {trezor.isFetched && (
          <div styleName='account'>
            <List component='nav' className='list'>
              {account.map(this._buildItem)}
            </List>
          </div>
        )}

        <div styleName='actions'>
          <Translate value='LoginWithMnemonic.or' />
          <br />
          <button onClick={navigateBack} styleName='link'>
            <Translate value='LoginWithMnemonic.back' />
          </button>
        </div>
      </div>
    )
  }
}

export default LoginTrezor
