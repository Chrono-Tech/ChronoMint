import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { List, ListItem } from 'material-ui/List'
import FontIcon from 'material-ui/FontIcon'
import { grey800 } from 'material-ui/styles/colors'
import { Link } from 'react-router'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = (state) => ({
  isCBE: state.get('session').isCBE
})

@connect(mapStateToProps, null)
class NavigationMenu extends Component {
  
  static propTypes = {
    isCBE: PropTypes.bool
  }
  
  render () {
    const styles = {
      menu: {
        paddingTop: 8
      },
      menuItem: {
        color: grey800,
        fontSize: 14
      },
      menuItemInner: {
        paddingLeft: '56px'
      }
    }

    const cbeMenu = [
      <ListItem
        key='locs'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText={<Translate value='nav.locs' />}
        leftIcon={<FontIcon className='material-icons'>group</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/cbe/locs'}} />}
      />,
      // <ListItem
      //    key="lhOperations"
      //    style={styles.menuItem}
      //    innerDivStyle={styles.menuItemInner}
      //    primaryText={<Translate value='nav.lhOperations'/>}
      //    leftIcon={<FontIcon className="material-icons">grid_on</FontIcon>}
      //    className="left-drawer-menu--item"
      //    containerElement={<Link activeClassName={'active'} to={{pathname: '/cbe/lh_story'}} />}
      // />,
      <ListItem
        key='pOperations'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText={<Translate value='nav.operations' />}
        leftIcon={<FontIcon className='material-icons'>alarm</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/cbe/operations'}} />}
      />,
      <ListItem
        key='settings'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText={<Translate value='nav.settings' />}
        leftIcon={<FontIcon className='material-icons'>settings</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/cbe/settings'}} />}
      />
    ]

    const userMenu = [
      <ListItem
        key='newWallet'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText={<Translate value='nav.markupWallet' />}
        leftIcon={<FontIcon className='material-icons'>account_balance_wallet</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/new/wallet'}} />}
      />,
      <ListItem
        key='rewards'
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText={<Translate value='nav.newRewards' />}
        leftIcon={<FontIcon className='material-icons'>card_giftcard</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/new/rewards'}} />}
      />,
      <ListItem
        key='exchange'
        disabled={true}
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText={<Translate value='nav.exchange' />}
        leftIcon={<FontIcon className='material-icons'>swap_horiz</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/wallet/exchange'}} />}
      />,
      <ListItem
        key='voting'
        disabled={true}
        style={styles.menuItem}
        innerDivStyle={styles.menuItemInner}
        primaryText={<Translate value='nav.voting' />}
        leftIcon={<FontIcon className='material-icons'>done</FontIcon>}
        className='left-drawer-menu--item'
        containerElement={<Link activeClassName={'active'} to={{pathname: '/voting'}} />}
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
