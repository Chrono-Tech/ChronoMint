import React, { Component } from 'react'
import WarningIcon from 'material-ui/svg-icons/alert/error'
import { Translate } from 'react-redux-i18n'
import { styles as stylesConfig } from 'Login/settings'
import './Warning.scss'

const styles = {
  width: 40,
  height: 40,
  color: stylesConfig.colors.warningColor
}

class Warning extends Component {
  render () {
    return (
      <div styleName='warningBox'>
        <div styleName='warningIcon'>
          <WarningIcon style={styles}/>
        </div>
        <div styleName='warningText'><Translate value='Warning.text' dangerousHTML/></div>
      </div>
    )
  }
}

export default Warning
