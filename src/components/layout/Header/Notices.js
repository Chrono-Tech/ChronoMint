// TODO new design
/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { IconMenu, IconButton, MenuItem } from 'material-ui'
import NotificationsIcon from 'material-ui/svg-icons/social/notifications'
import { white } from 'material-ui/styles/colors'

const style = {
  cursor: 'default'
}

const mapStateToProps = (state) => ({
  list: state.get('notifier').list
})

@connect(mapStateToProps)
class Notices extends Component {
  render () {
    const list = this.props.list.valueSeq().splice(15).sortBy(n => n.time()).reverse()
    let i = 0
    return (
      <IconMenu color={white}
        iconButtonElement={<IconButton><NotificationsIcon color={white} /></IconButton>}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
        {list.size > 0 ? (<div>
          {list.map(item =>
            <MenuItem key={i++} primaryText={item.historyBlock()} style={style} />
          )}
        </div>) : (<MenuItem primaryText={'No notifications'} style={style} />)}
      </IconMenu>
    )
  }
}

export default Notices
