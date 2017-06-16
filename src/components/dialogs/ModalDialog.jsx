import React from 'react'
import PropTypes from 'prop-types'

import './ModalDialog.scss'

export class ModalDialog extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func
  }

  handleBackdropTap(e) {
    if (this.props.onClose) {
      this.props.onClose(e)
    }
  }

  render() {

    return (
      <div styleName="root" className="ModalDialog__backdrop"
        onTouchTap={(e) => {
          e.stopPropagation()
          this.handleBackdropTap(e)
        }}
      >
        <div styleName="dialog" className="ModalDialog__dialog"
          onTouchTap={(e) => {
            e.stopPropagation()
          }}
        >
          <div styleName="content" className="ModalDialog__content">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default ModalDialog
