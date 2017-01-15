import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Assessment from 'material-ui/svg-icons/action/assessment';
import Group from 'material-ui/svg-icons/social/group';
import Pages from 'material-ui/svg-icons/social/pages';
import GridOn from 'material-ui/svg-icons/image/grid-on';
import {white, darkWhite} from 'material-ui/styles/colors';
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
            <ListItem
                key="dashboard"
                style={styles.menuItem}
                primaryText="Dashboard"
                leftIcon={<Assessment color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/'}} />}
            />,
            <ListItem
                key="locs"
                style={styles.menuItem}
                primaryText="LOC Admin"
                leftIcon={<Group color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/locs'}} />}
            />,
            <ListItem
                key="lhOperations"
                style={styles.menuItem}
                primaryText="LH Operations"
                leftIcon={<GridOn color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/operations'}} />}
            />,
            <ListItem
                key="pOperations"
                style={styles.menuItem}
                primaryText="Pending Operations"
                leftIcon={<GridOn color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/operations', query: {pending: true}}} />}
            />
        ];

        const locMenu = [
            <ListItem
                key="dashboard"
                style={styles.menuItem}
                primaryText="Dashboard"
                leftIcon={<Assessment color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/'}} />}
            />,
            <ListItem
                key="locDetails"
                style={styles.menuItem}
                primaryText="LOC Details"
                leftIcon={<Pages color={darkWhite}/>}
                containerElement={<Link to={{pathname: '/loc'}} />}
            />,
            <ListItem
                key="lhWorkers"
                style={styles.menuItem}
                primaryText="LH Admin"
                leftIcon={<Group color={darkWhite}/>}
                rightIcon={<ActionInfo color={darkWhite} />}
                containerElement={<Link to={{pathname: '/workers'}} />}
            />,
            <ListItem
                key="lhOperations"
                style={styles.menuItem}
                primaryText="LH Operations"
                leftIcon={<GridOn color={darkWhite}/>}
                rightIcon={<ActionInfo color={darkWhite} />}
                containerElement={<Link to={{pathname: '/operations'}} />}
            />
        ];

        const {user} = this.props;
        return (
            <List style={styles.menu}>
                {
                    user.profile.type === 'loc' ? locMenu : cbeMenu
                }
            </List>
        );
    }
}

export default NavigationMenu;