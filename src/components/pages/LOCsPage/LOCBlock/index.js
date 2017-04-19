import React, {Component} from 'react'
import Paper from 'material-ui/Paper'
import globalStyles from '../../../../styles'
import {dateFormatOptions} from '../../../../config'
import Buttons from './Buttons'
import StatusBlock from './StatusBlock'

class LOCBlock extends Component {
  constructor (props) {
    super(props)
    this.state = {value: 1}
  }

  render () {
    const {loc} = this.props
    const expDate = loc.expDate()
    return (
      <Paper style={globalStyles.item.paper}>
        <div>
          <StatusBlock expDate={expDate} status={loc.status()} />

          <div style={globalStyles.item.title}>{loc.name()}</div>
          <div style={globalStyles.item.greyText}>
            Issue limit: {loc.issueLimit()} LHUS<br />
            Total issued amount: {loc.issued()} LHUS<br />
            {/* Total redeemed amount: {loc.redeemed()} LHUS<br /> */}
            {/* Amount in circulation: {loc.issued() - loc.redeemed()} LHUS<br /> */}
            Exp date: {new Date(expDate).toLocaleDateString('en-us', dateFormatOptions)}<br />
            {loc.get('address')}
          </div>
          <div style={globalStyles.item.lightGrey}>
            {/* Added on {new Date(expDate).toLocaleDateString('en-us', dateFormatOptions)} */}
            {/* TODO: change expDate to creationDate */}
          </div>
        </div>
        <Buttons loc={loc} />
      </Paper>
    )
  }
}

export default LOCBlock
