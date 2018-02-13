import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_SIDES } from 'redux/sides/actions'

import './SideStack.scss'

function mapStateToProps (state) {
  return {
    stack: state.get(DUCK_SIDES).stack,
  }
}

@connect(mapStateToProps)
class SideStack extends PureComponent {
  static propTypes = {
    stack: PropTypes.array,
  }

  render () {
    return (
      <div styleName='root'>
        { this.props.stack.map((panel) => (
          <div key={panel.key}>
            <panel.component {...panel.props} />
          </div>
        )) }
      </div>
    )
  }
}

export default SideStack
