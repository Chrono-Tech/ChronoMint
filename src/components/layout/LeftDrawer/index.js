import React,  { PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import UserInfo from './UserInfo';
import NavigationMenu from './NavigationMenu';
import './style.scss';

const styles = {
    container: {
        paddingTop: 56,
        backgroundColor: '#fff'
    }
};

const LeftDrawer = ({navDrawerOpen}) => {
    return (
        <Drawer
            docked={true}
            className="left-drawer"
            containerStyle={styles.container}
            open={navDrawerOpen}>
            <UserInfo />
            <NavigationMenu />
        </Drawer>
    );
};

LeftDrawer.propTypes = {
    navDrawerOpen: PropTypes.bool,
    menus: PropTypes.array,
};

export default LeftDrawer;
