import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import WarningIcon from 'material-ui/svg-icons/alert/error'
import colors from '../../../../styles/themes/variables'

import './Warning.scss'

const styles = {
  width: 40,
  height: 40,
  color: colors.warningColor,
}

class Warning extends PureComponent {
  render () {
    return (
      <div styleName='warningBox'>
        <div styleName='warningIcon'>
          <WarningIcon style={styles} />
        </div>
        <div styleName='warningText'><Translate value='Warning.text' dangerousHTML /></div>
      </div>
    )
  }
}

export default Warning
