import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import './ModalStack.scss'

export class ModalStack extends PureComponent {
  render () {
    return (
      <div styleName='root'>
        { this.props.stack.map(modal => (
          <div key={modal.key}>
            <modal.component {...modal.props} />
          </div>
        )) }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    stack: state.get('modals').stack,
  }
}

ModalStack.propTypes = {
  stack: PropTypes.array,
}

export default connect(mapStateToProps)(ModalStack)
