import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from '../styles'
import { CBEAddresses } from '../components/pages/SettingsPage'
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
        <CBEAddresses />
      </div>
    )
  }
}

export default SettingsPage
