import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, ListItem} from 'material-ui/List'
import FontIcon from 'material-ui/FontIcon'
import {grey800} from 'material-ui/styles/colors'
import {IndexLink, Link} from 'react-router'
import PendingOperationsCountLabel from './PendingOperationsCountLabel'

const mapStateToProps = (state) => ({
  isCBE: state.get('session').isCBE
})

@connect(mapStateToProps, null)
class NavigationMenu extends Component {
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
    }

    const cbeMenu = [
      <ListItem
        key='dashboard'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText='CBE Dashboard'
        leftIcon={<FontIcon className='material-icons'>assessment</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<IndexLink activeClassName={'active'} to={{pathname: '/cbe'}} />}
      />,
      <ListItem
        key='locs'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText='LOC Admin'
        leftIcon={<FontIcon className='material-icons'>group</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/cbe/locs'}} />}
      />,
      // <ListItem
      //    key="lhOperations"
      //    style={styles.menuItem}
      //    innerDivStyle={styles.menuItemInner}
      //    primaryText="LH Operations"
      //    leftIcon={<FontIcon className="material-icons">grid_on</FontIcon>}
      //    className="left-drawer-menu--item"
      //    containerElement={<Link activeClassName={'active'} to={{pathname: '/cbe/lh_story'}} />}
      // />,
      <ListItem
        key='pOperations'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText='Operations'
        leftIcon={<FontIcon className='material-icons'>alarm</FontIcon>}
        rightIcon={<PendingOperationsCountLabel />}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/cbe/operations', query: {pending: true}}} />}
      />,
      <ListItem
        key='settings'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText='Settings'
        leftIcon={<FontIcon className='material-icons'>settings</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/cbe/settings'}} />}
      />
    ]

    const userMenu = [
      <ListItem
        key='wallet'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText='Wallet'
        leftIcon={<FontIcon className='material-icons'>account_balance_wallet</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<IndexLink activeClassName={'active'} to={{pathname: '/wallet'}} />}
      />,
      <ListItem
        key='exchange'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText='Exchange'
        leftIcon={<FontIcon className='material-icons'>swap_horiz</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/wallet/exchange'}} />}
      />,
      <ListItem
        key='voting'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText='Voting'
        leftIcon={<FontIcon className='material-icons'>done</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/voting'}} />}
      />,
      <ListItem
        key='rewards'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText='Rewards'
        leftIcon={<FontIcon className='material-icons'>card_giftcard</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/rewards'}} />}
      />
    ]

    return (
      <List style={styles.menu} className='left-drawer-menu'>
        {this.props.isCBE ? [...userMenu, ...cbeMenu] : userMenu}
      </List>
    )
  }
}

export default NavigationMenu
