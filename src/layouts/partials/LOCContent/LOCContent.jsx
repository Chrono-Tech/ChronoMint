import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { CircularProgress } from 'material-ui'
import { getLOCs } from 'redux/locs/actions'
import Search from 'components/locs/Search'
import PageTitle from 'components/locs/PageTitle'
import LOCItem from 'components/locs/LOCItem/LOCItem'
import type LOCModel from 'models/LOCModel'
import './LOCContent.scss'

const mapStateToProps = state => state.get('locs')

const mapDispatchToProps = dispatch => ({
  getLOCs: () => dispatch(getLOCs()),
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCContent extends React.Component {
  static propTypes = {
    locs: PropTypes.object,
    filter: PropTypes.string,
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    getLOCs: PropTypes.func,
  }

  componentWillMount() {
    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getLOCs()
    }
  }

  render() {
    const { locs, filter } = this.props

    return !this.props.isFetched
      ? (<div styleName='progress'><CircularProgress size={24} thickness={1.5} /></div>)
      : (
        <div styleName='content'>
          <PageTitle />
          <Search />
          <div><Translate value='locs.entries' number={locs.size} /></div>

          <div styleName='grid'>
            {locs
              .filter(loc => loc.name().toLowerCase().indexOf(filter) > -1)
              .sortBy(loc => -loc.createDate())
              .map((loc: LOCModel, key) => (
                <div key={key} styleName='item'>
                  <LOCItem loc={loc} />
                </div>
              ))
              .toArray()
            }
          </div>
        </div>
      )
  }
}

export default LOCContent
