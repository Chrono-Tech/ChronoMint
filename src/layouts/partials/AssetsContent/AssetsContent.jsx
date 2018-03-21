import React, { Component } from 'react'
import { connect } from 'react-redux'
import AssetManager from 'components/assetsManager/AssetManager/AssetManager'

import './AssetsContent.scss'

function mapStateToProps (/* state */) {
  return {}
}

function mapDispatchToProps (/* dispatch */) {
  return {
    // getRewardsData: () => dispatch(getRewardsData()),
    // watchInitRewards: () => dispatch(watchInitRewards())
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AssetsContent extends Component {
  static propTypes = {
    /*    ready: PropTypes.bool,
        rewardsData: PropTypes.object,
        isRewardsFetched: PropTypes.bool,
        isVotingFetched: PropTypes.bool,
        watchInitRewards: PropTypes.func,
        getRewardsData: PropTypes.func */
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <AssetManager />
          </div>
        </div>
      </div>
    )
  }
}
