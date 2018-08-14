/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

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
  DUCK_DEVICE_ACCOUNT,
} from '@chronobank/core/redux/device/constants'

import './LoginWithTrezor.scss'

const mapStateToProps = (state) => {
  return {
    isLoading: state.get(DUCK_DEVICE_ACCOUNT).isLoading,
    accounts: state.get(DUCK_DEVICE_ACCOUNT).deviceList,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fetchAccount: () => dispatch(fetchAccount()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class LoginTrezor extends PureComponent {
  static propTypes = {
    fetchAccount: PropTypes.func,
    onBack: PropTypes.func,
    previousPage: PropTypes.func,
    isLoading: PropTypes.bool,
    accounts: PropTypes.instanceOf(Array),
    onDeviceSelect: PropTypes.func,
  }

  componentDidUpdate (prevProps) {
    //if (!this.props.trezor.isFetched && !this.props.trezor.isFetching) {
    //  this.props.fetchAccount()
    //}
  }

  componentWillUnmount () {
  }

  renderStates () {
    return (
          <div styleName='state' key='1'>
            <div styleName='titleContent'>
              <div styleName='title'>zzz</div>
              <div styleName='subtitle'>zzz</div>
            </div>
          </div>
    )
  }

  _buildItem = (item, index) => {
    return (
      <div key={index}>
        <ListItem
          button
          type='submit'
          name='address'
          value={item.address}
          component='button'
          disableGutters
          style={{ margin: 0 }}
          onClick={() => this.props.onDeviceSelect(item)}
        >
          <ListItemText
            style={{ paddingLeft:"10px" }}
            disableTypography
            primary={
              <Typography
                type='body2'
                style={{ color: 'black', fontWeight: 'bold' }}
              >
                {item.address}
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
    const { previousPage, accounts, isLoading } = this.props
    console.log('isLoading')
    console.log(isLoading)
    return (
      <div styleName='form'>
        <div styleName='page-title'>
          <Translate value='LoginWithTrezor.title' />
        </div>
        {!isLoading && (
        <div styleName='states'>
          {this.renderStates()}
        </div>
	)}

        {isLoading && (
          <div styleName='account'>
            <List component='nav' className='list'>
              {accounts.map(this._buildItem)}
            </List>
          </div>
        )}

        <div styleName='actions'>
          <Translate value='LoginWithMnemonic.or' />
          <br />
          <button onClick={previousPage} styleName='link'>
            <Translate value='LoginWithMnemonic.back' />
          </button>
        </div>
      </div>
    )
  }
}

export default LoginTrezor
