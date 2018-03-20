import React, { PureComponent } from 'react'

import './MenuTokenMoreInfo.scss'

export const PANEL_KEY = 'MenuTokenMoreInfo_panelKey'

export default class MenuTokenMoreInfo extends PureComponent {
  render () {
    return (
      <div styleName='root'>
        <div styleName='transparent-part'>
          &nbsp;
        </div>
        <div styleName='content-part'>
          <b>MenuTokenMorePanel</b>
        </div>
      </div>
    )
  }
}
