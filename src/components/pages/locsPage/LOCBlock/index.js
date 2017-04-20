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
            Issue limit: {loc.issueLimit()} LHT<br />
            Total issued amount: {loc.issued()} LHT<br />
            {/* Total redeemed amount: {loc.redeemed()} LHT<br /> */}
            {/* Amount in circulation: {loc.issued() - loc.redeemed()} LHT<br /> */}
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
