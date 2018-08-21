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

import './LoginWithLedger.scss'

const mapStateToProps = (state) => {
  return {
    isLoading: state.get(DUCK_DEVICE_ACCOUNT).isLoading,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fetchNextAccounts: () => dispatch(fetchNextAccounts()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class LoginWithLedger extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
    isLoading: PropTypes.bool,
    onDeviceSelect: PropTypes.func,
  }

  componentDidUpdate (prevProps) {
    //if (!this.props.trezor.isFetched && !this.props.trezor.isFetching) {
    //  this.props.fetchAccount()
    //}
  }

  componentWillUnmount () {
  }

  _buildItem (item, index) {
    return <MenuItem value={index} key={index} primaryText={item} />
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
          disableGutters={true}
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
    const { previousPage, deviceList, isLoading } = this.props
    console.log('isLoading')
    console.log(isLoading)
    return (
      <div styleName='form'>
        <div styleName='page-title'>
          <Translate value='LoginWithLedger.title' />
        </div>
        {!isLoading && (
        <div styleName='states'>
          {this.renderStates()}
        </div>
	)}

        {isLoading && (
          <div styleName='account'>
            <List component='nav' className='list'>
              {deviceList.map(this._buildItem)}
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

export default LoginWithLedger
