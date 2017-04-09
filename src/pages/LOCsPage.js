import React, {Component} from 'react'
import {connect} from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'
import PageBase from '../pages/PageBase2'
import {getLOCs} from '../redux/locs/actions'
import {PageTitle, Search, Filter, LOCBlock} from '../components/pages/LOCsPage/'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
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
      this.props.getLOCs(this.props.account)
    }
  }

  render () {
    const {locs} = this.props
    return (
      <PageBase title={<PageTitle />}>

        <Search />

        <Filter locs={locs} />

        {locs.map((loc, key) => <LOCBlock key={key} loc={loc} />).toArray()}

        {
          this.props.isFetching
            ? <CircularProgress style={{position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)'}} />
            : null
        }

      </PageBase>
    )
  }
}

export default LOCsPage
