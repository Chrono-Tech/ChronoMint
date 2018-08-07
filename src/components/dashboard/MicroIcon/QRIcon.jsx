/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Popover } from '@material-ui/core'
import PropTypes from 'prop-types'
import QRCode from 'qrcode'
import React, { PureComponent } from 'react'
import promisify from 'promisify-node-callback'

import './MicroIcon.scss'

export default class QRIcon extends PureComponent {
  static propTypes = {
    value: PropTypes.node,
    iconStyle: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    iconStyle: 'micro',
  }

  constructor (props) {
    super(props)
    this.state = {
      isQROpen: false,
      qrData: null,
      qrAnchorEl: null,
    }
  }

  async handleQROpen (target) {
    this.setState({
      isQROpen: true,
      qrData: this.state.qrData || await promisify(QRCode.toDataURL)(this.props.value),
      qrAnchorEl: target,
    })
  }

  handleQRClose () {
    this.setState({
      isQROpen: false,
      qrAnchorEl: null,
    })
  }

  renderQR () {
    return (
      <img alt='qr code' src={this.state.qrData} />
    )
  }

  render () {
    return (
      <div styleName='root' className='QRIcon__root'>
        <span
          styleName={this.props.iconStyle}
          onClick={(e) => {
            e.preventDefault()
            this.handleQROpen(e.currentTarget)
          }}
        >
          {this.props.children
            ? this.props.children
            : <i className='material-icons'>center_focus_weak</i>
          }

        </span>
        <Popover
          open={this.state.isQROpen}
          anchorEl={this.state.qrAnchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          onClose={this.handleQRClose.bind(this)}
          style={{ zIndex: 3000 }}
        >
          {this.renderQR()}
        </Popover>
      </div>
    )
  }
}
