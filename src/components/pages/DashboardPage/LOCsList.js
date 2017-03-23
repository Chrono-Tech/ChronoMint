import React, {PropTypes} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {grey400, white} from 'material-ui/styles/colors';
import {typography} from 'material-ui/styles';
import Wallpaper from 'material-ui/svg-icons/social/group';

const RecentlyProducts = (props) => {

  const styles = {
    subheader: {
      fontSize: 24,
      fontWeight: typography.fontWeightLight,
      backgroundColor: '#17579c',
      color: white
    }
  };

  const iconButtonElement = (
    <IconButton
      touch={true}
      tooltipPosition="bottom-left">
      <MoreVertIcon color={grey400} />
    </IconButton>
  );

  const rightIconMenu = key => (
    <IconMenu iconButtonElement={iconButtonElement}>
      <MenuItem onTouchTap={()=>{props.view(key)}}>View</MenuItem>
    </IconMenu>
  );

  const secondaryText = value => (
      <span>{value} LHAU issued.</span>
  );

  return (
    <Paper>
      <List>
        <Subheader style={styles.subheader}>Recent LOCs</Subheader>
        {props.data.map((item, key) =>
          <div key={key}>
            <ListItem
              leftAvatar={<Avatar icon={<Wallpaper />} />}
              primaryText={item.get('locName')}
              secondaryText={secondaryText(item.issueLimit())}
              rightIconButton={rightIconMenu(key)}
            />
            <Divider inset={true} />
          </div>
        )}
      </List>
    </Paper>
  );
};

RecentlyProducts.propTypes = {
  data: PropTypes.array,
  view: PropTypes.func
};

export default RecentlyProducts;
