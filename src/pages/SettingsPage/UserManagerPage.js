import React, { Component } from 'react'
import styles from '../../styles'
import { Translate } from 'react-redux-i18n'
import CBEAddresses from '../../components/pages/SettingsPage/UserManagerPage/CBEAddresses'

export default class UserManagerPage extends Component {
  render () {
    return (
      <div>
        <span style={styles.navigation}>
          <Translate value='nav.project' /> / <Translate value='nav.settings' /> /&nbsp;
          <Translate value='settings.user.title' />
        </span>

        <CBEAddresses />
      </div>
    )
  }
}
