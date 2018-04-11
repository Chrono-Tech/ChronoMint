/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CircularProgress } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import type LOCModel from 'models/LOCModel'
import { getLOCs } from 'redux/locs/actions'
import LOCItem from 'components/locs/LOCItem/LOCItem'
import PageTitle from 'components/locs/PageTitle'
import Search from 'components/locs/Search'

import './LOCContent.scss'

const mapStateToProps = (state) => state.get('locs')

const mapDispatchToProps = (dispatch) => ({
  getLOCs: () => dispatch(getLOCs()),
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCContent extends PureComponent {
  static propTypes = {
    locs: PropTypes.object,
    filter: PropTypes.string,
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    getLOCs: PropTypes.func,
  }

  componentWillMount () {
    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getLOCs()
    }
  }

  render () {
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
              .filter((loc) => loc.name().toLowerCase().indexOf(filter) > -1)
              .sortBy((loc) => -loc.createDate())
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
