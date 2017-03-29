import React, {Component} from 'react'
import {connect} from 'react-redux'
import PageBase from '../pages/PageBase2'
import {getLOCs} from '../redux/locs/actions'
import {PageTitle, Search, Filter, LOCBlock} from '../components/pages/LOCsPage/'

const mapStateToProps = (state) => ({
  locs: state.get('locs'),
  isReady: state.get('locsCommunication').isReady,
  isFetching: state.get('locsCommunication').isFetching
})

const mapDispatchToProps = (dispatch) => ({
  getLOCs: (account) => dispatch(getLOCs(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCsPage extends Component {
  componentWillMount () {
    if (!this.props.isReady && !this.props.isFetching) {
      this.props.getLOCs(window.localStorage.chronoBankAccount)
    }
  }

  render () {
    const {locs} = this.props
    return (
      <PageBase title={<PageTitle handleShowLOCModal={this.handleShowLOCModal} />}>

        <Search />

        <Filter locs={locs} />

        {locs.map((loc, key) => <LOCBlock key={key} loc={loc} />).toArray()}

      </PageBase>
    )
  }
}

export default LOCsPage
