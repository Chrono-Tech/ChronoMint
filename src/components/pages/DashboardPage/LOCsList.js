import React from 'react'
import { connect } from 'react-redux'
import { List, Subheader, Paper, CircularProgress } from 'material-ui'
import { white } from 'material-ui/styles/colors'
import { typography } from 'material-ui/styles'
import ShortLOCBlock from '../LOCsPage/LOCBlock/ShortLOCBlock'

import { getLOCs } from '../../../redux/locs/list/actions'
import { Translate } from 'react-redux-i18n'

const styles = {
  subheader: {
    fontSize: 24,
    fontWeight: typography.fontWeightLight,
    backgroundColor: '#17579c',
    color: white
  }
}

const mapStateToProps = (state) => ({
  locs: state.get('locs').locs,
  isFetched: state.get('locs').isFetched,
  isFetching: state.get('locs').isFetching
})

const mapDispatchToProps = (dispatch) => ({
  getLOCs: () => dispatch(getLOCs())
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCsList extends React.Component {
  componentWillMount () {
    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getLOCs()
    }
  }

  render () {
    const {locs} = this.props
    return (
      <Paper>
        <List>
          <Subheader style={styles.subheader}><Translate value='locs.recent' /></Subheader>
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
