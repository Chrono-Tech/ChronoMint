import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import Label from '../../common/Label';

import {grey800} from 'material-ui/styles/colors';
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
            },
            menuItemInner: {
                paddingLeft: '54px'
            }
        };

        const cbeMenu = [
            <ListItem
                key="dashboard"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="Dashboard"
                leftIcon={<FontIcon className="material-icons">assessment</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<IndexLink activeClassName={'active'} to={{pathname: '/'}} />}
            />,
            <ListItem
                key="locs"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="LOC Admin"
                leftIcon={<FontIcon className="material-icons">group</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/locs'}} />}
            />,
            <ListItem
                key="Contracts"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="Contracts"
                leftIcon={<FontIcon className="material-icons">grid_on</FontIcon>}
                rightIcon={<Label count={1} />}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/operations'}} />}
            />,
            <ListItem
                key="rewards"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="Rewards"
                leftIcon={<FontIcon className="material-icons">account_balance_wallet</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/rewards'}} />}
            />,
            <ListItem
                key="lhOperations"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="LH Operations"
                leftIcon={<FontIcon className="material-icons">grid_on</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/lh_story'}} />}
            />,
            <ListItem
                key="pOperations"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="Pending Operations"
                leftIcon={<FontIcon className="material-icons">alarm</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/operations', query: {pending: true}}} />}
            />,
            <ListItem
                key="settings"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="Settings"
                leftIcon={<FontIcon className="material-icons">settings</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/settings'}} />}
            />
        ];

        const locMenu = [
            <ListItem
                key="dashboard"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="Dashboard"
                leftIcon={<FontIcon className="material-icons">assessment</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<IndexLink activeClassName={'active'} to={{pathname: '/'}} />}
            />,
            <ListItem
                key="locDetails"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="LOC Details"
                leftIcon={<FontIcon className="material-icons">pages</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/loc'}} />}
            />,
            <ListItem
                key="lhWorkers"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="LH Admin"
                leftIcon={<FontIcon className="material-icons">group</FontIcon>}
                rightIcon={<Label count={2} />}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/workers'}} />}
            />,
            <ListItem
                key="lhOperations"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="LH Operations"
                leftIcon={<FontIcon className="material-icons">grid_on</FontIcon>}
                rightIcon={<Label count={1} />}
                className="left-drawer-menu--item"
                containerElement={<Link activeClassName={'active'} to={{pathname: '/operations'}} />}
            />
        ];

        const userMenu = [
            <ListItem
                key="wallet"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
                primaryText="Wallet"
                leftIcon={<FontIcon className="material-icons">account_balance_wallet</FontIcon>}
                className="left-drawer-menu--item"
                containerElement={<IndexLink activeClassName={'active'} to={{pathname: '/wallet'}} />}
            />,
            <ListItem
                key="exchange"
                style={styles.menuItem}
                innerDivStyle={styles.menuItemInner}
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
                menu = [...locMenu, ...userMenu];
                break;
            case 'cbe':
                menu = [...cbeMenu, ...userMenu];
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