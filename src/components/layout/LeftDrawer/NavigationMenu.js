import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import ActionInfo from 'material-ui/svg-icons/action/info';
import Contracts from 'material-ui/svg-icons/device/widgets';
import {grey800, pinkA200} from 'material-ui/styles/colors';
import {IndexLink, Link} from 'react-router';

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
                color: grey800,
                fontSize: 14
            }
        };

        const cbeMenu = [
            <ListItem
                key="dashboard"
                style={styles.menuItem}
                primaryText="Dashboard"
                leftIcon={<FontIcon className="material-icons">assessment</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<IndexLink activeClassName={'active'} to={{pathname: '/'}} />}
            />,
            <ListItem
                key="locs"
                style={styles.menuItem}
                primaryText="LOC Admin"
                leftIcon={<FontIcon className="material-icons">group</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/locs'}} />}
            />,
            <ListItem
                key="Contracts"
                style={styles.menuItem}
                primaryText="Contracts"
                leftIcon={<FontIcon className="material-icons">grid_on</FontIcon>}
                rightIcon={<Contracts color={pinkA200} />}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/operations'}} />}
            />,
            <ListItem
                key="rewards"
                style={styles.menuItem}
                primaryText="Rewards"
                leftIcon={<FontIcon className="material-icons">account_balance_wallet</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/rewards'}} />}
            />,
            <ListItem
                key="lhOperations"
                style={styles.menuItem}
                primaryText="LH Operations"
                leftIcon={<FontIcon className="material-icons">grid_on</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/lh_story'}} />}
            />,
            <ListItem
                key="pOperations"
                style={styles.menuItem}
                primaryText="Pending Operations"
                leftIcon={<FontIcon className="material-icons">alarm</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/operations', query: {pending: true}}} />}
            />
        ];

        const locMenu = [
            <ListItem
                key="dashboard"
                style={styles.menuItem}
                primaryText="Dashboard"
                leftIcon={<FontIcon className="material-icons">assessment</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<IndexLink activeClassName={'active'} to={{pathname: '/'}} />}
            />,
            <ListItem
                key="locDetails"
                style={styles.menuItem}
                primaryText="LOC Details"
                leftIcon={<FontIcon className="material-icons">pages</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/loc'}} />}
            />,
            <ListItem
                key="lhWorkers"
                style={styles.menuItem}
                primaryText="LH Admin"
                leftIcon={<FontIcon className="material-icons">group</FontIcon>}
                rightIcon={<ActionInfo color={pinkA200} />}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/workers'}} />}
            />,
            <ListItem
                key="lhOperations"
                style={styles.menuItem}
                primaryText="LH Operations"
                leftIcon={<FontIcon className="material-icons">grid_on</FontIcon>}
                rightIcon={<ActionInfo color={pinkA200} />}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/operations'}} />}
            />
        ];

        const userMenu = [
            <ListItem
                key="wallet"
                style={styles.menuItem}
                primaryText="Wallet"
                leftIcon={<FontIcon className="material-icons">account_balance_wallet</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/wallet'}} />}
            />,
            <ListItem
                key="exchange"
                style={styles.menuItem}
                primaryText="Exchange"
                leftIcon={<FontIcon className="material-icons">swap_horiz</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/wallet/exchange'}} />}
            />
        ];

        const {user} = this.props;
        let menu;

        switch(user.profile.type) {
            case 'loc':
                menu = locMenu;
                break;
            case 'cbe':
                menu = cbeMenu;
                break;
            default:
                menu = userMenu;
                break;
        }

        return (
            <List style={styles.menu} className="left-drawer-menu">
                {menu}
            </List>
        );
    }
}

export default NavigationMenu;