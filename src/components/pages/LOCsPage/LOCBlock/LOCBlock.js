import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import globalStyles from '../../../../styles'
import Buttons from './Buttons'
import StatusBlock from './StatusBlock'
import './LOCBlock.scss'

class LOCBlock extends Component {
  render () {
    const {loc} = this.props

    return (
      <Paper style={globalStyles.item.paper}>
        <div styleName='title'>{loc.name()}</div>

        <StatusBlock expDate={loc.expDate()} status={loc.status()} />

        <div style={globalStyles.item.greyText}>
          {loc.isPending() && <div style={{color: 'red', border: '4px solid'}}>PENDING</div>}
          Issue limit: {loc.issueLimit()} LHT<br />
          Total issued amount: {loc.issued()} LHT<br />
          Exp date: {loc.expDateString()}<br />
        </div>
        <Buttons loc={loc} />
      </Paper>
    )
  }
}

export default LOCBlock
