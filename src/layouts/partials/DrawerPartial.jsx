import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { List, ListItem, IconButton, FontIcon } from 'material-ui'
import { menu } from './HeaderPartial'
import styles from './styles'
import { logout } from '../../redux/session/actions'
import { Link } from 'react-router'
import './DrawerPartial.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class DrawerPartial extends React.Component {

  static propTypes = {
    isCBE: PropTypes.bool,
  }

  constructor (props) {
    super(props)
    this.menu = [...menu]

    this.menu = [
      ...menu,
      props.isCBE
        ? {key: 'cbeSettings', title: 'CBE Settings', icon: 'settings', path: '/cbe/settings'}
        : {key: 'oldInterface', title: 'Old Interface', icon: 'dashboard', path: '/profile'}
    ]

    this.state = {
      isOpened: false
    }
  }

  handleClick = () => {
    this.setState({isOpened: !this.state.isOpened})
  }

  render () {
    return (
      <div styleName={`root ${this.state.isOpened ? 'opened' : 'closed'}`}>
        <div
          styleName='backdrop'
          onTouchTap={this.handleClick}
        />
        <div styleName='content'>
          <div styleName='menu'>
            <IconButton onTouchTap={this.handleClick}>
              <FontIcon className='material-icons'>menu</FontIcon>
            </IconButton>
          </div>
          <List>
            {this.menu.map(item => (
              <ListItem
                key={item.key}
                styleName='item'
                style={styles.drawer.item.style}
                innerDivStyle={styles.drawer.item.innerDivStyle}
                primaryText={item.title}
                leftIcon={
                  <FontIcon
                    style={styles.drawer.item.iconStyle}
                    className='material-icons'>{item.icon}</FontIcon>
                }
                containerElement={
                  <Link styleName activeClassName={'drawer-item-active'} to={{pathname: item.path}} />
                }
              />
            ))}
          </List>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    isCBE: state.get('session').isCBE
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleLogout: () => dispatch(logout())
  }
}
