import React, { Component } from 'react'
import { connect } from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'
import { getLOCs } from '../redux/locs/list/actions'
import LOCBlock from '../components/pages/LOCsPage/LOCBlock/LOCBlock'
import PageTitle from '../components/pages/LOCsPage/PageTitle'
import Search from '../components/pages/LOCsPage/Search'

import { Translate } from 'react-redux-i18n'

const mapStateToProps = (state) => state.get('locs')

const mapDispatchToProps = (dispatch) => ({
  getLOCs: () => dispatch(getLOCs())
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCsPage extends Component {
  componentWillMount () {
    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getLOCs()
    }
  }

  render () {
    const {locs, filter} = this.props
    return (
      <div className='page-base'>
        <PageTitle />

        {this.props.isFetching
          ? <CircularProgress
            style={{position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)'}} />
          : (
            <div>
              <Search />
              <div><Translate value='locs.entries' number={locs.size} /></div>
              {locs
                .filter(loc => loc.name().toLowerCase().indexOf(filter) > -1)
                .map((loc, key) => <LOCBlock key={key} loc={loc} />).toArray()
              }
            </div>
          )}
      </div>
    )
  }
}

export default LOCsPage
