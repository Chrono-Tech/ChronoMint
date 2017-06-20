import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import globalStyles from '../../../../styles'
import Buttons from './Buttons'
import './LOCBlock.scss'
import { Translate } from 'react-redux-i18n'
import { LinearProgress } from 'material-ui'
import statuses from './statuses'

class LOCBlock extends Component {
  render () {
    const {loc} = this.props
    const currency = loc.currencyString()
    const status = statuses[loc.status()]

    return (
      <Paper style={globalStyles.item.paper}>
        <div styleName='title'>{loc.name()}</div>
        {loc.isPending() && <span styleName='pending'><Translate value='terms.pending' /></span>}
        {loc.isFailed() && <span styleName='failed'><Translate value='terms.failed' /></span>}

        <div styleName='statusWrapper'>
          <div styleName={`statusText ${status.styleName}`}>
            <Translate value={status.token} />
          </div>
          <div styleName='statusDays'><Translate value='locs.daysLeft' />: {loc.daysLeft()}</div>
        </div>

        <LinearProgress
          mode='determinate'
          min={loc.createDate()}
          max={loc.expDate()}
          value={Date.now()}
        />

        <div style={globalStyles.item.greyText}>
          Issue limit: {loc.issueLimit()} {currency}<br />
          Total issued amount: {loc.issued()} {currency}<br />
          Create date: {loc.createDateString()}<br />
          Exp date: {loc.expDateString()}<br />
          Currency: {currency}
        </div>
        <Buttons loc={loc} />
      </Paper>
    )
  }
}

export default LOCBlock
