import {
  NETWORK_STATUS_OFFLINE,
  NETWORK_STATUS_ONLINE,
  NETWORK_STATUS_UNKNOWN,
  SYNC_STATUS_SYNCED,
  SYNC_STATUS_SYNCING,
} from '@chronobank/login/network/MonitorService'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { drawerHide, drawerToggle } from 'redux/drawer/actions'
import { logout, DUCK_SESSION } from 'redux/session/actions'
import { getProfileTokensList } from 'redux/session/selectors'
import { DUCK_MONITOR } from '@chronobank/login/redux/monitor/actions'

import './MenuTokensList.scss'

function mapStateToProps (state) {
  const session = state.get(DUCK_SESSION)
  const monitor = state.get(DUCK_MONITOR)

  return {
    account: session.account,
    tokens: getProfileTokensList()(state),
    networkStatus: monitor.network,
    syncStatus: monitor.sync,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDrawerToggle: () => dispatch(drawerToggle()),
    handleDrawerHide: () => dispatch(drawerHide()),
    handleLogout: () => dispatch(logout()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MenuTokensList extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    tokens: PropTypes.arrayOf(PropTypes.object),
    networkStatus: PropTypes.shape({
      status: PropTypes.string,
    }),
    syncStatus: PropTypes.shape({
      status: PropTypes.string,
      progress: PropTypes.number,
    }),
  }

  renderStatus () {
    const { networkStatus, syncStatus } = this.props

    switch (networkStatus.status) {
      case NETWORK_STATUS_ONLINE: {
        switch (syncStatus.status) {
          case SYNC_STATUS_SYNCED:
            return (<div styleName='icon status-synced' />)
          case SYNC_STATUS_SYNCING:
          default:
            return (<div styleName='icon status-syncing' />)
        }
      }
      case NETWORK_STATUS_OFFLINE:
        return (<div styleName='icon status-offline' />)
      case NETWORK_STATUS_UNKNOWN:
      default:
        return null
    }
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='item'>
          <div styleName='syncIcon'>
            {this.renderStatus()}
          </div>
          <div styleName='addressTitle'>
            <div styleName='addressName'>Main address</div>
            <div styleName='address'>
              {this.props.account}
            </div>
          </div>
          <div styleName='itemMenu' >
            <i className='material-icons'>more_vert</i>
          </div>
        </div>

        {this.props.tokens
          .map((token) => {

            return (
              <div styleName='item' key={token.blockchain}>
                <div styleName='syncIcon'>
                  <span styleName={classnames('icon', { 'status-synced': !!token.address, 'status-offline': !token.address })} />
                </div>
                <div styleName='addressTitle'>
                  <div styleName='addressName'>{token.title}</div>
                  <div styleName='address'>
                    {token.address}
                  </div>
                </div>
                <div styleName='itemMenu' >
                  <i className='material-icons'>more_vert</i>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
