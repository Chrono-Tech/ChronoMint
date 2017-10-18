import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'

import { modalsClose } from 'redux/modals/actions'

import ModalDialog from '../ModalDialog'

import './ModalDialogBase.scss'

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(modalsClose()),
})

@connect(null, mapDispatchToProps)
class ModalDialogBase extends Component {
  static propTypes = {
    title: PropTypes.any,
    subTitle: PropTypes.any,
    closeModal: PropTypes.func,
    children: PropTypes.any,
  }
  render() {
    const { title, subTitle } = this.props
    const titleToken = typeof title === 'string' ? { value: title } : title

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        <ModalDialog
          onClose={() => this.props.closeModal()}
        >
          <div styleName='root'>
            <div styleName='header'>
              <h3 styleName='title'>{<Translate {...titleToken} />}</h3>
              {subTitle}
            </div>
            <div styleName='content'>
              {this.props.children}
            </div>
          </div>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

export default ModalDialogBase
