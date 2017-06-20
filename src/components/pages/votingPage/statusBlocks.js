import React, {Component} from 'react'
import PropTypes from 'prop-types'
import globalStyles from '../../../styles'

const ongoingStatusBlock = <div style={globalStyles.item.status.block}>
  <div style={globalStyles.item.status.orange}>
    ONGOING<br />
  </div>
</div>

const closedStatusBlock = <div style={globalStyles.item.status.block}>
  <div style={globalStyles.item.status.red}>
    CLOSED<br />
  </div>
</div>

const notActiveStatusBlock = <div style={globalStyles.item.status.block}>
  <div style={globalStyles.item.status.red}>
    NOT ACTIVE<br />
  </div>
</div>

const finishedStatusBlock = <div style={globalStyles.item.status.block}>
  <div style={globalStyles.item.status.red}>
    FINISHED<br />
  </div>
</div>

class StatusBlock extends Component {
  render () {
    const {poll} = this.props
    return (<div>
      {poll.activated() ? poll.ongoing() ? poll.deadline() > new Date().getTime() ? ongoingStatusBlock : finishedStatusBlock : closedStatusBlock : notActiveStatusBlock}
    </div>
    )
  }
}

StatusBlock.propTypes = {
  poll: PropTypes.object
}

export default StatusBlock
