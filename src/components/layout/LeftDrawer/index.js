import React from 'react'
import PropTypes from 'prop-types'
import Drawer from './Drawer'
import UserInfo from './UserInfo'
import NavigationMenu from './NavigationMenu'
import './style.scss'

const styles = {
  container: {
    paddingTop: 56,
    backgroundColor: '#fff'
  }
}

const LeftDrawer = ({navDrawerOpen, navDrawerDocked, navDrawerChange}) => {
  return (
    <Drawer
      docked={navDrawerDocked}
      className='left-drawer'
      containerStyle={styles.container}
      open={navDrawerOpen}
      onRequestChange={navDrawerChange}
    >
      <UserInfo />
      <NavigationMenu />
    </Drawer>
  )
}

LeftDrawer.propTypes = {
  navDrawerOpen: PropTypes.bool,
  navDrawerDocked: PropTypes.bool,
  navDrawerChange: PropTypes.func,
  menus: PropTypes.array
}

export default LeftDrawer
