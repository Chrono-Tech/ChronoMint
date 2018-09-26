/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { getIsSession } from '@chronobank/core/redux/session/selectors'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import Markup from 'layouts/Markup'

function mapStateToProps (state) {
  return {
    isLoggedIn: getIsSession(state),
  }
}

class ProtectedRoute extends PureComponent {
  render () {
    const { isLoggedIn, ...rest } = this.props

    if (!isLoggedIn) return <Redirect to={{ pathname: '/login' }} />

    return (
      <Markup>
        <Route {...rest} />
      </Markup>
    )
  }
}

export default connect(mapStateToProps)(ProtectedRoute)
