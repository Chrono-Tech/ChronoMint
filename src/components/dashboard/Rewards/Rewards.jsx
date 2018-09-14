/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import RewardsPeriod from 'components/dashboard/RewardsPeriod/RewardsPeriod'
import SplitSection from 'components/dashboard/SplitSection/SplitSection'
import { Paper } from '@material-ui/core'
import Button from 'components/common/ui/Button/Button'
import RewardsPeriodModel from '@chronobank/core/models/rewards/RewardsPeriodModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { Link } from 'react-router-dom'

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
                <Button>
                  <Link activeclassname='active' to={{ pathname: '/rewards' }}>
                    <Translate value={prefix('allPeriods')} />
                  </Link>
                </Button>
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
