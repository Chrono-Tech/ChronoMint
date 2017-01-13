import React, {Component} from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {white} from 'material-ui/styles/colors';
import {connect} from 'react-redux';
import {logout} from '../../../redux/ducks/session';

const mapDispatchToProps = (dispatch) => ({
   logout: () => dispatch(logout())
});

@connect(null, mapDispatchToProps)
class HeaderActions extends Component {
    constructor() {
        super();
    }

    render() {
        const {logout} = this.props;
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