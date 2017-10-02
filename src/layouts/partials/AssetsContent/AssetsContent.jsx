import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Paper } from 'material-ui'
import styles from 'layouts/partials/styles'
import AssetManager from 'components/assets/AssetManager/AssetManager'
import './AssetsContent.scss'

// function prefix (token) {
//   return 'layouts.partials.AssetsContent.' + token
// }

export class AssetsContent extends Component {

  static propTypes = {
    /*    ready: PropTypes.bool,
        rewardsData: PropTypes.object,
        isRewardsFetched: PropTypes.bool,
        isVotingFetched: PropTypes.bool,
        watchInitRewards: PropTypes.func,
        getRewardsData: PropTypes.func*/
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <div className='AssetsContent__grid'>
              <div className='row'>
                <div className='col-xs-6'>
                  <Paper style={styles.content.paper.style}>
                    <AssetManager />
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (/*state*/) {
  return {}
}

function mapDispatchToProps (/*dispatch*/) {
  return {
    // getRewardsData: () => dispatch(getRewardsData()),
    // watchInitRewards: () => dispatch(watchInitRewards())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetsContent)
