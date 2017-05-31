import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import globalStyles from '../../../../styles'
import { dateFormatOptions } from '../../../../config'
import Buttons from './Buttons'
import StatusBlock from './StatusBlock'
import './LOCBlock.scss'

class LOCBlock extends Component {
  render () {
    const {loc} = this.props
    const expDate = loc.expDate()
    return (
      <Paper style={globalStyles.item.paper}>
        <div styleName='title'>{loc.name()}</div>

        <StatusBlock expDate={expDate} status={loc.status()} />

        <div style={globalStyles.item.greyText}>
          Issue limit: {loc.issueLimit()} LHT<br />
          Total issued amount: {loc.issued()} LHT<br />
          Exp date: {new Date(expDate).toLocaleDateString('en-us', dateFormatOptions)}<br />
          {loc.get('address')}
        </div>
        <Buttons loc={loc} />
      </Paper>
    )
  }
}

export default LOCBlock
