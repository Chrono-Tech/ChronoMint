import React from 'react'
import globalStyles from '../../../styles'

export const ongoingStatusBlock = <div style={globalStyles.item.status.block}>
  <div style={globalStyles.item.status.orange}>
    ONGOING<br />
  </div>
</div>

export const closedStatusBlock = <div style={globalStyles.item.status.block}>
  <div style={globalStyles.item.status.red}>
    DECLINED<br />
  </div>
</div>
