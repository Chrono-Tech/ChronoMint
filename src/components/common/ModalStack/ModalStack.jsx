import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { DUCK_MODALS } from 'redux/modals/actions'

import './ModalStack.scss'

function mapStateToProps (state) {
  return {
    stack: state.get(DUCK_MODALS).stack,
  }
}

@connect(mapStateToProps)
export class ModalStack extends React.Component {
  static propTypes = {
    stack: PropTypes.array,
  }

  render () {
    return (
      <div styleName='root'>
        { this.props.stack.map((modal) => (
          <div key={modal.key}>
            <modal.component {...modal.props} />
          </div>
        )) }
      </div>
    )
  }
}

export default ModalStack
