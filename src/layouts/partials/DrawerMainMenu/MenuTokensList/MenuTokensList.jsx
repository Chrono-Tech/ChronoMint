import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { drawerHide, drawerToggle } from 'redux/drawer/actions'
import { logout } from 'redux/session/actions'
import { getProfileTokensList } from 'redux/session/selectors'

import './MenuTokensList.scss'

function mapStateToProps (state) {
  const session = state.get('session')
  return {
    account: session.account,
    tokens: getProfileTokensList()(state),
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
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='item'>
          <div styleName='syncIcon'>
            <span styleName='icon' />
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
                  <span styleName='icon' />
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
