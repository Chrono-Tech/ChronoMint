import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IconMenu, IconButton, MenuItem} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {white} from 'material-ui/styles/colors';
import {logout} from '../../../redux/ducks/session/data';

const mapDispatchToProps = (dispatch) => ({
   logout: () => dispatch(logout())
});

@connect(null, mapDispatchToProps)
class HeaderActions extends Component {
    render() {
        const logout = this.props.logout;
        return (
            <IconMenu color={white}
                      iconButtonElement={<IconButton><MoreVertIcon color={white}/></IconButton>}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                <MenuItem primaryText="Sign out"
                          onClick={logout}
                          onTouchTap={logout} />
            </IconMenu>
        );
    }
}

export default HeaderActions;