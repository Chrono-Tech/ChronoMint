import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { SidePanel } from 'layouts/partials'
import { DUCK_SIDES } from 'redux/sides/actions'

import './SideStack.scss'

export const PROFILE_SIDE_PANEL_KEY = 'ProfileSidePanelKey'
export const NOTIFICATION_SIDE_PANEL_KEY = 'NotificationSidePanelKey'

function mapStateToProps (state) {
  return {
    stack: state.get(DUCK_SIDES).stack,
  }
}

@connect(mapStateToProps)
class SideStack extends PureComponent {
  static propTypes = {
    stack: PropTypes.objectOf(PropTypes.object),
  }

  render () {
    return (
      <div styleName='root'>
        {Object.values(this.props.stack).map((panel) => (
          <SidePanel key={panel.panelKey} {...panel} />
        ))}
      </div>
    )
  }
}

export default SideStack
