import React, {Component} from 'react';
import Assessment from 'material-ui/svg-icons/action/assessment';
import GridOn from 'material-ui/svg-icons/image/grid-on';
import {white, darkWhite} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router';

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

        return (
            <div style={styles.menu}>
                <MenuItem
                    key="dashboard"
                    style={styles.menuItem}
                    primaryText="Dashboard"
                    leftIcon={<Assessment color={darkWhite}/>}
                    containerElement={<Link to={{pathname: '/'}} />}
                />
                <MenuItem
                    key="locs"
                    style={styles.menuItem}
                    primaryText="LOCs"
                    leftIcon={<GridOn color={darkWhite}/>}
                    containerElement={<Link to={{pathname: '/table'}} />}
                />
                <MenuItem
                    key="operations"
                    style={styles.menuItem}
                    primaryText="Operations"
                    leftIcon={<GridOn color={darkWhite}/>}
                    containerElement={<Link to={{pathname: '/operations'}} />}
                />
            </div>
        );
    }
}

export default NavigationMenu;