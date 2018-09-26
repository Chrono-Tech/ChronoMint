/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Route } from 'react-router-dom'
import Splash from 'layouts/Splash/Splash'

class LoginRoute extends PureComponent {
  render () {
    return (
      <Splash>
        <Route
          {...this.props}
        />
      </Splash>
    )
  }
}

export default LoginRoute
