/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { UserRow, Button } from 'components'

// import styles from 'layouts/Splash/styles'
import './ImportMethodsPage.scss'

export default class ImportMethodsPage extends PureComponent {
  render () {
    return (
      <MuiThemeProvider>
        <div styleName='form'>

          <div styleName='page-title'>Add an Existing Account</div>

          <div styleName='methods'>
            <Button>

            </Button>
          </div>

          <div styleName='actions'>
            or <br />
            <Link to='/' href styleName='link'>Create New Account</Link>
          </div>

        </div>
      </MuiThemeProvider>
    )
  }
}
