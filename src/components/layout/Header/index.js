import React from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/svg-icons/navigation/menu'
import SearchIcon from 'material-ui/svg-icons/action/search'
import {white} from 'material-ui/styles/colors'
import SearchBox from './SearchBox'
import HeaderActions from './HeaderActions'
import Notices from './Notices'

const style = {
  appBar: {
    position: 'fixed',
    top: 0,
    overflow: 'hidden',
    zIndex: 1400
  },
  title: {
    fontSize: 20,
    height: 56,
    maxHeight: 56
  },
  iconsRightContainer: {
    marginLeft: 20
  }
}

class Header extends React.Component {
  constructor () {
    super()
    this.state = {
      searchOpen: false
    }
  }

  handleToggleSearch = () => {
    this.setState({searchOpen: !this.state.searchOpen})
  };

  render () {
    const {handleChangeRequestNavDrawer} = this.props
    const {searchOpen} = this.state

    return (
      <AppBar
        style={style.appBar}
        titleStyle={style.title}
        title={searchOpen ? <SearchBox /> : 'ChronoMint'}
        iconElementLeft={
          <IconButton onClick={handleChangeRequestNavDrawer}>
            <Menu color={white} />
          </IconButton>
        }
        iconElementRight={
          <div style={style.iconsRightContainer}>
            <IconButton onClick={this.handleToggleSearch}>
              <SearchIcon color={white} />
            </IconButton>

            <Notices />

            <HeaderActions />
          </div>
        }
      />
    )
  }
}

Header.propTypes = {
  handleChangeRequestNavDrawer: PropTypes.func
}

export default Header
