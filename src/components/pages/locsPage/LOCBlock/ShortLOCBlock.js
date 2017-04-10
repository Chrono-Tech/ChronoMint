import React, {Component} from 'react'

import {ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Wallpaper from 'material-ui/svg-icons/social/group'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import {grey400} from 'material-ui/styles/colors'

const iconButtonElement = (
  <IconButton
    touch
    tooltipPosition='bottom-left'>
    <MoreVertIcon color={grey400} />
  </IconButton>
)

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>View</MenuItem>
  </IconMenu>
)

class ShortLOCBlock extends Component {
  constructor (props) {
    super(props)
    this.state = {value: 1}
  }

  render () {
    const {loc} = this.props
    return (
      <div>
        <ListItem
          leftAvatar={<Avatar icon={<Wallpaper />} />}
          primaryText={loc.get('locName')}
          secondaryText={`${loc.issued()} of ${loc.issueLimit()} LHT issued`}
          rightIconButton={rightIconMenu}
        />
        <Divider inset />
      </div>
    )
  }
}

export default ShortLOCBlock
