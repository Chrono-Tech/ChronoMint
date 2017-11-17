// TODO New Dashboard
/* eslint-disable */
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import globalStyles from '../../../styles'

const mapStateToProps = (state) => ({
  user: state.get('session')
})

@connect(mapStateToProps, null)
class Breadcrumbs extends PureComponent {
  render () {
    return (
      <h3 style={globalStyles.navigation}>
        ChronoMint / { this.props.user.type === 'cbe' ? 'CBE Dashboard' : 'LOC Dashboard'}
      </h3>
    )
  }
}

export default Breadcrumbs
