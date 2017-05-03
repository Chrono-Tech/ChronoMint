import React, { Component } from 'react'
import styles from '../styles'
import { Translate } from 'react-redux-i18n'

class OperationsPage extends Component {
  render () {
    return (
      <div>
        <span style={styles.navigation}>ChronoMint / <Translate value='nav.operations' /></span>
        <h1>Work in progress...</h1>
      </div>
    )
  }
}

export default OperationsPage
