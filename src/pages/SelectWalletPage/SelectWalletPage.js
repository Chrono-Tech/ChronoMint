/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { UserRow, Button } from 'components'

import arrow from 'assets/img/icons/prev-white.svg'
import pageStyles from './SelectWalletPage.scss'

export default class SelectWalletPage extends PureComponent {
  static propTypes = {
    onWalletSelect: PropTypes.func,
    walletsList: PropTypes.arrayOf(
      PropTypes.shape({
        img: PropTypes.string,
        address: PropTypes.string,
      })
    ),
  }

  static defaultProps = {
    onWalletSelect: () => {},
    walletsList: [],
  }

  render () {
    const { onWalletSelect, walletsList } = this.props
    return (
      <MuiThemeProvider>
        <div styleName='wrapper'>

          <div styleName='page-title'>My Accounts</div>

          <div styleName='user-rows'>
            {
              walletsList ? walletsList.map((w, i) => (
                <UserRow
                  key={i}
                  title={w.address}
                  avatar={w.img}
                  actionIcon={arrow}
                  actionIconClass={pageStyles.actionIcon}
                  onClick={() => onWalletSelect(w)}
                />
              )) : null
            }
          </div>

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
            >
              Add an existing account
            </Button>
            or <br />
            <Link to='/' href styleName='link'>Create New Account</Link>
          </div>

        </div>
      </MuiThemeProvider>
    )
  }
}
