import React, { Component } from 'react'
import styles from '../../styles'
import { Translate } from 'react-redux-i18n'
import Tokens from '../../components/pages/SettingsPage/ERC20ManagerPage/Tokens'

export default class ERC20ManagerPage extends Component {
  render () {
    return (
      <div>
        <span style={styles.navigation}>
          <Translate value='nav.project' /> / <Translate value='nav.settings' /> /&nbsp;
          <Translate value='settings.erc20.title' />
        </span>

        <Tokens />
      </div>
    )
  }
}
