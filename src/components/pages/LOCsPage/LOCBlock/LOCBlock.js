import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import globalStyles from '../../../../styles'
import Buttons from './Buttons'
import StatusBlock from './StatusBlock'
import './LOCBlock.scss'
import { Translate } from 'react-redux-i18n'

class LOCBlock extends Component {
  render () {
    const {loc} = this.props
    const currency = loc.currencyString()

    return (
      <Paper style={globalStyles.item.paper}>
        <div styleName='title'>{loc.name()}</div>
        {loc.isPending() && <span styleName='pending'><Translate value='terms.pending' /></span>}

        <StatusBlock expDate={loc.expDate()} status={loc.status()} />

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
