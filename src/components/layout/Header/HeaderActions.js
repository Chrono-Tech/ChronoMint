// TODO New Design
/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { IconMenu, IconButton, MenuItem, Divider } from 'material-ui'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import { white } from 'material-ui/styles/colors'
import { Translate } from 'react-redux-i18n'
import { logout } from '../../../redux/session/actions'

const mapDispatchToProps = (dispatch) => ({
  handleLogout: () => dispatch(logout()),
  handleProfile: () => dispatch(push('/profile'))
})

@connect(null, mapDispatchToProps)
class HeaderActions extends Component {
  render () {
    return (
      <IconMenu color={white}
        iconButtonElement={<IconButton><MoreVertIcon color={white} /></IconButton>}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
        <MenuItem primaryText={<Translate value='nav.profile' />} onTouchTap={this.props.handleProfile} />
        <Divider style={{height: '2px'}} />
        <MenuItem primaryText={<Translate value='nav.signOut' />} onTouchTap={this.props.handleLogout} />
      </IconMenu>
    )
  }
}

export default HeaderActions
