import React from 'react'
import {connect} from 'react-redux'
import {List} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Paper from 'material-ui/Paper'
import {white} from 'material-ui/styles/colors'
import {typography} from 'material-ui/styles'
import ShortLOCBlock from '../locsPage/LOCBlock/ShortLOCBlock'

import {getLOCs} from '../../../redux/locs/actions'

const styles = {
  subheader: {
    fontSize: 24,
    fontWeight: typography.fontWeightLight,
    backgroundColor: '#17579c',
    color: white
  }
}

const mapStateToProps = (state) => ({
  locs: state.get('locs'),
  isReady: state.get('locsCommunication').isReady,
  isFetching: state.get('locsCommunication').isFetching
})

const mapDispatchToProps = (dispatch) => ({
  getLOCs: (account) => dispatch(getLOCs(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCsList extends React.Component {
  componentWillMount () {
    if (!this.props.isReady && !this.props.isFetching) {
      this.props.getLOCs(window.localStorage.chronoBankAccount)
    }
  }

  render () {
    const {locs} = this.props
    return (
      <Paper>
        <List>
          <Subheader style={styles.subheader}>Recent LOCs</Subheader>
          {locs.map((loc, key) => <ShortLOCBlock key={key} loc={loc} />).toArray()}
        </List>
      </Paper>
    )
  }
}

export default LOCsList
