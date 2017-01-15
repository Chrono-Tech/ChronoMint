import React, {Component} from 'react';
import {connect} from 'react-redux';
import Assessment from 'material-ui/svg-icons/action/assessment';
import GridOn from 'material-ui/svg-icons/image/grid-on';
import {white, darkWhite} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router';

const mapStateToProps = (state) => ({
   user: state.get('session')
});

@connect(mapStateToProps, null)
class NavigationMenu extends Component {
    constructor() {
        super();
    }

    render() {
        const styles = {
            menu: {
                paddingTop: 8
            },
            menuItem: {
                color: white,
                fontSize: 14
            }
        };

        const cbeMenu = [
            <MenuItem
                key="dashboard"
                style={styles.menuItem}
                primaryText="Dashboard"
                leftIcon={<Assessment color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/'}} />}
            />,
            <MenuItem
                key="locs"
                style={styles.menuItem}
                primaryText="LOCs"
                leftIcon={<GridOn color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/locs'}} />}
            />,
            <MenuItem
                key="operations"
                style={styles.menuItem}
                primaryText="Operations"
                leftIcon={<GridOn color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/operations'}} />}
            />
        ];

        const locMenu = [
            <MenuItem
                key="dashboard"
                style={styles.menuItem}
                primaryText="Dashboard"
                leftIcon={<Assessment color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/'}} />}
            />,
            <MenuItem
                key="locDetails"
                style={styles.menuItem}
                primaryText="LOC Details"
                leftIcon={<GridOn color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/loc-info'}} />}
            />,
            <MenuItem
                key="lhWorkers"
                style={styles.menuItem}
                primaryText="LH Workers"
                leftIcon={<GridOn color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/workers'}} />}
            />,
            <MenuItem
                key="lhTokens"
                style={styles.menuItem}
                primaryText="LH Tokens"
                leftIcon={<GridOn color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/tokens'}} />}
            />
        ];

        const {user} = this.props;
        return (
            <div style={styles.menu}>
                {
                    user.profile.type === 'loc' ? locMenu : cbeMenu
                }
            </div>
        );
    }
}

export default NavigationMenu;