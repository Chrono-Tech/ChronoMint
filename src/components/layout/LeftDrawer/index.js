import React,  { PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import UserInfo from './UserInfo';
import NavigationMenu from './NavigationMenu';

const styles = {
    container: {
        paddingTop: 56
    }
};

const LeftDrawer = ({navDrawerOpen, menus}) => {
    return (
        <Drawer
            docked={true}
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
