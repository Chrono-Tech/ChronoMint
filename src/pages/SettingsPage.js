import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from '../styles'
import {
  Tokens,
  CBEAddresses,
  OtherContracts
} from '../components/pages/SettingsPage'
import withSpinner from '../hoc/withSpinner'

const mapStateToProps = (state) => ({
  isFetching: state.get('settingsTokens').isFetching ||
  state.get('settingsCBE').isFetching ||
  state.get('settingsOtherContracts').isFetching
})

@connect(mapStateToProps, null)
@withSpinner
class SettingsPage extends Component {
  render () {
    return (
      <div>
        <span style={styles.navigation}>ChronoMint / Settings</span>

        <Tokens />

        <div style={styles.paperSpace}/>

        <CBEAddresses />

        <div style={styles.paperSpace}/>

        <OtherContracts />
      </div>
    )
  }
}

export default SettingsPage
