/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_MODALS } from 'redux/modals/constants'

import './ModalStack.scss'

function mapStateToProps (state) {
  return {
    stack: state.get(DUCK_MODALS).stack,
  }
}

@connect(mapStateToProps)
class ModalStack extends PureComponent {
  static propTypes = {
    stack: PropTypes.array,
  }

  render () {
    return (
      <div styleName='root'>
        {this.props.stack.map((modal) => (
          <div key={modal.key}>
            <modal.component {...modal.props} />
          </div>
        ))}
      </div>
    )
  }
}

export default ModalStack
