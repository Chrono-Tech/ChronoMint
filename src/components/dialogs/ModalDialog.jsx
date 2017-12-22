import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { modalsClose } from 'redux/modals/actions'
import './ModalDialog.scss'

const TRANSITION_TIMEOUT = 250

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class ModalDialog extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    modalsClose: PropTypes.func,
    onModalClose: PropTypes.func,
  }

  handleClose = (e) => {
    this.props.onModalClose ?
      this.props.onModalClose()
      : this.props.modalsClose()
    e.stopPropagation()
  }

  handleStopPropagation = (e) => {
    e.stopPropagation()
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={TRANSITION_TIMEOUT}
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}
      >
        <div
          styleName='root'
          className={classnames('ModalDialog__backdrop', this.props.className)}
        >
          <div
            styleName='dialog'
            className='ModalDialog__dialog'
            onTouchTap={this.handleStopPropagation}
          >
            <div styleName='content' className='ModalDialog__content'>
              {this.props.children}
            </div>
            <div
              styleName='close'
              className='ModalDialog__close'
              onTouchTap={this.handleClose}
            ><i className='material-icons'>close</i>
            </div>
          </div>
        </div>
      </CSSTransitionGroup>
    )
  }
}
