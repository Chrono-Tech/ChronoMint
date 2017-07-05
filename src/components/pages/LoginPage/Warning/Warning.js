import React, { Component } from 'react'
import WarningIcon from 'material-ui/svg-icons/alert/error'
import colors from '../../../../styles/themes/variables'
import './Warning.scss'

const styles = {
  width: 40,
  height: 40,
  color: colors.warningColor
}

class Warning extends Component {
  render () {
    return (
      <div styleName='warningBox'>
        <div styleName='warningIcon'>
          <WarningIcon style={styles} />
        </div>
        <div styleName='warningText'>Keep it safe!<br />
          Make a backup!<br />
          Don&apos;t share it with anyone!<br />
          Don&apos;t lose it! It cannot be recovered if you lose it.
        </div>
      </div>
    )
  }
}

export default Warning
