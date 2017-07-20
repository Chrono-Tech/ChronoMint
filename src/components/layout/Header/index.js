import React from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/svg-icons/navigation/menu'
import { white } from 'material-ui/styles/colors'
import SearchBox from './SearchBox'
import HeaderActions from './HeaderActions'
import Notices from './Notices'
import PendingTxs from './PendingTxs'
import Locales from './Locales'

const style = {
  appBar: {
    position: 'fixed',
    width: 'auto',
    left: 0,
    right: 0,
    top: 0,
    overflow: 'hidden',
    zIndex: 1400,
    marginLeft: '-10px'
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
            <Notices />
            <PendingTxs />
            <Locales />

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
