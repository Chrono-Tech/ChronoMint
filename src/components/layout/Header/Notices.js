import React, {Component} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import {IconMenu, IconButton, MenuItem} from 'material-ui'
import NotificationsIcon from 'material-ui/svg-icons/social/notifications'
import {white} from 'material-ui/styles/colors'
import {listNotices} from '../../../redux/notifier/notifier'

const style = {
  cursor: 'default'
}

const mapStateToProps = (state) => ({
  list: state.get('notifier').list
})

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listNotices()),
  handleShowMore: () => dispatch(push('/notices'))
})

@connect(mapStateToProps, mapDispatchToProps)
class Notices extends Component {
  componentDidMount () {
    this.props.getList()
  }

  render () {
    const list = this.props.list.entrySeq().splice(5)
    return (
      <IconMenu color={white}
        iconButtonElement={<IconButton><NotificationsIcon color={white} /></IconButton>}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
        {list.size > 0 ? (<div>
          {list.map(([index, item]) =>
            <MenuItem key={index} primaryText={item.historyBlock()} style={style} />
          )}
          <MenuItem primaryText={'Show more'} onTouchTap={this.props.handleShowMore} />
        </div>) : (<MenuItem primaryText={'No notifications'} style={style} />)}
      </IconMenu>
    )
  }
}

export default Notices
