/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import RewardsPeriod from 'components/dashboard/RewardsPeriod/RewardsPeriod'
import SplitSection from 'components/dashboard/SplitSection/SplitSection'
import { Paper, RaisedButton } from 'material-ui'
import RewardsPeriodModel from 'models/rewards/RewardsPeriodModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { Link } from 'react-router'

import './Rewards.scss'

function prefix (token) {
  return `Dashboard.Rewards.${token}`
}

class Rewards extends PureComponent {
  static propTypes = {
    period: PropTypes.instanceOf(RewardsPeriodModel),
  }

  render () {
    return (
      <Paper>
        <div styleName='root'>
          <SplitSection
            title='Rewards'
            head={(
              <div styleName='title'>
                <h3><Translate value={prefix('title')} /></h3>
              </div>
            )}
            foot={(
              <div styleName='buttons'>
                <RaisedButton
                  label={<Translate value={prefix('allPeriods')} />}
                  primary
                  containerElement={<Link activeClassName='active' to={{ pathname: '/rewards' }} />}
                />
              </div>
            )}
          >
            <RewardsPeriod period={this.props.period} />
          </SplitSection>
        </div>
      </Paper>
    )
  }
}

export default Rewards
