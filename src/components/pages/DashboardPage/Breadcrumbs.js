// TODO New Dashboard
/* eslint-disable */
import React, { Component } from 'react'
import globalStyles from '../../../styles'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  user: state.get('session')
})

@connect(mapStateToProps, null)
class Breadcrumbs extends Component {
  render () {
    return (
      <h3 style={globalStyles.navigation}>
        ChronoMint / { this.props.user.type === 'cbe' ? 'CBE Dashboard' : 'LOC Dashboard'}
      </h3>
    )
  }
}

export default Breadcrumbs
