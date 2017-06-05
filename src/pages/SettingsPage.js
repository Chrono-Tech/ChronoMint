import React, { Component } from 'react'
import { Paper } from 'material-ui'
import { Link } from 'react-router'
import { Translate } from 'react-redux-i18n'
import styles from '../styles'

class SettingsPage extends Component {
  render () {
    return (
      <div>
        <span style={styles.navigation}><Translate value='nav.project' /> / <Translate value='nav.settings' /></span>

        <Paper style={styles.paper}>
          <Link activeClassName={'active'} to={{pathname: '/cbe/settings/user'}}>
            <h3 style={styles.title}><Translate value='settings.user.title' /></h3>
          </Link>
        </Paper>

        <Paper style={styles.paper}>
          <Link activeClassName={'active'} to={{pathname: '/cbe/settings/erc20'}}>
            <h3 style={styles.title}><Translate value='settings.erc20.title' /></h3>
          </Link>
        </Paper>

      </div>
    )
  }
}

export default SettingsPage
