/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { TransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import ModalDialog from '../ModalDialog'

import './ModalDialogBase.scss'

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(modalsClose()),
})

@connect(
  null,
  mapDispatchToProps
)
class ModalDialogBase extends PureComponent {
  static propTypes = {
    title: PropTypes.any,
    subTitle: PropTypes.any,
    closeModal: PropTypes.func,
    children: PropTypes.any,
  }
  render () {
    const { title, subTitle } = this.props
    const titleToken = typeof title === 'string' ? { value: title } : title

    return (
      <TransitionGroup>
        <ModalDialog onClose={this.props.closeModal}>
          <div styleName="root">
            <div styleName="header">
              <h3 styleName="title">{<Translate {...titleToken} />}</h3>
              {subTitle}
            </div>
            <div styleName="content">{this.props.children}</div>
          </div>
        </ModalDialog>
      </TransitionGroup>
    )
  }
}

export default ModalDialogBase
