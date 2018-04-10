/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Link } from 'react-router'
import { NavDrawer, List, ListItem } from 'react-toolbox'
import React, { PureComponent } from 'react'

export default class LayoutTest extends PureComponent {
  render () {
    return (
      <NavDrawer
        active
        pinned
        permanentAt='xxxl'
      >
        <Link to='/markup/dashboard'>Dashboard</Link>
        <Link to='/markup/exchange'>Exchange</Link>
        <Link to='/markup/wallet'>Wallet</Link>
        <List>
          <ListItem caption='Dashboard' leftIcon='send' to='/markup/dashboard' />
          <ListItem caption='Wallet' leftIcon='delete' to='/markup/exchange' />
          <ListItem caption='Exchange' leftIcon='delete' to='/markup/wallet' />
        </List>
      </NavDrawer>
    )
  }
}

