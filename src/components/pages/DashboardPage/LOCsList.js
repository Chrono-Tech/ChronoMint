import React from 'react'
import { connect } from 'react-redux'
import { List, Subheader, Paper, CircularProgress } from 'material-ui'
import { white } from 'material-ui/styles/colors'
import { typography } from 'material-ui/styles'
import ShortLOCBlock from '../LOCsPage/LOCBlock/ShortLOCBlock'
import ls from '../../../utils/localStorage'
import localStorageKeys from '../../../constants/localStorageKeys'

import { getLOCs } from '../../../redux/locs/list/actions'

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
      this.props.getLOCs(ls(localStorageKeys.ACCOUNT))
    }
  }

  render () {
    const {locs} = this.props
    return (
      <Paper>
        <List>
          <Subheader style={styles.subheader}>Recent LOCs</Subheader>
          {this.props.isFetching
            ? <div style={{textAlign: 'center', marginTop: '25px', marginBottom: '10px'}}>
              <CircularProgress size={34} thickness={1.5} />
            </div>
            : locs.map((loc, key) => <ShortLOCBlock key={key} loc={loc} />).toArray()}
        </List>
      </Paper>
    )
  }
}

export default LOCsList
