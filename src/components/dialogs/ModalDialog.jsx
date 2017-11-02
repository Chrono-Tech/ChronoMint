import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classnames from 'classnames'

import './ModalDialog.scss'

export class ModalDialog extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClose: PropTypes.func,
  }

  handleBackdropTap (e) {
    if (this.props.onClose) {
      this.props.onClose(e)
    }
  }

  render () {
    return (
      <div
        styleName='root'
        className={classnames('ModalDialog__backdrop', this.props.className)}
        onTouchTap={e => {
          e.stopPropagation()
          this.handleBackdropTap(e)
        }}
      >
        <div
          styleName='dialog'
          className='ModalDialog__dialog'
          onTouchTap={e => {
            e.stopPropagation()
          }}
        >
          <div styleName='content' className='ModalDialog__content'>
            {this.props.children}
          </div>
          <a
            styleName='close'
            className='ModalDialog__close'
            onTouchTap={e => {
              e.stopPropagation()
              this.handleBackdropTap(e)
            }}
          ><i className='material-icons'>close</i>
          </a>
        </div>
      </div>
    )
  }
}

export default ModalDialog
