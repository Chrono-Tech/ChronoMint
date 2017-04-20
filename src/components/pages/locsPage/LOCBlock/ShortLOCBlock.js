import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Wallpaper from 'material-ui/svg-icons/social/group'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import {grey400} from 'material-ui/styles/colors'
import { handleShowLOCModal } from '../../../../redux/locs/locModalActions'

const iconButtonElement = (
  <IconButton
    touch
    tooltipPosition='bottom-left'>
    <MoreVertIcon color={grey400} />
  </IconButton>
)

const mapDispatchToProps = (dispatch) => ({
  handleViewContract: loc => dispatch(handleShowLOCModal(loc))
})

@connect(null, mapDispatchToProps)
class ShortLOCBlock extends Component {
  getRightMenu (loc) {
    return (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem
          onTouchTap={() => {
            this.props.handleViewContract(loc)
          }}>View</MenuItem>
      </IconMenu>
    )
  }

  render () {
    const {loc} = this.props
    return (
      <div>
        <ListItem
          leftAvatar={<Avatar icon={<Wallpaper />} />}
          primaryText={loc.get('locName')}
          secondaryText={`${loc.issued()} of ${loc.issueLimit()} LHT issued`}
          rightIconButton={this.getRightMenu(loc)}
        />
        <Divider inset />
      </div>
    )
  }
}

export default ShortLOCBlock
